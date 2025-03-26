import "server-only"

import { and, eq, isNull } from "drizzle-orm"
import { db } from "."
import { folders_table as foldersSchema, files_table as filesSchema, files_table } from "~/server/db/schema";

export async function getAllParentsForFolder(folderId: number) {
    const parents = []
    let currentId: number | null = folderId
    while (currentId !== null) {
        const folder = await db
            .selectDistinct()
            .from(foldersSchema)
            .where(eq(foldersSchema.id, currentId))

        if (!folder[0]) {
            throw new Error("Parent not found")
        }

        parents.unshift(folder[0])
        currentId = folder[0]?.parent
    }
    return parents
}

export async function getRootFolderForUser(userId: string){
    const folder = await db.select().from(foldersSchema).where(and(eq(foldersSchema.ownerId, userId),isNull(foldersSchema.parent)))

    return folder[0]
}

export async function getFolderById(folderId: number) {
    const folder = await db.select().from(foldersSchema).where(eq(foldersSchema.id, folderId))

    return folder[0]
}

export async function getFileById(fileId: number) {
    const file = await db.select().from(files_table).where(eq(files_table.id, fileId))

    return file[0]
}

export function getFolders(folderId: number) {
    return db.select().from(foldersSchema).where(eq(foldersSchema.parent, folderId)).orderBy(foldersSchema.id)
}


export function getFiles(folderId: number) {
    return db.select().from(filesSchema).where(eq(filesSchema.parent, folderId)).orderBy(filesSchema.id)
}

export async function createFile(input: {
    file: {
        name: string;
        size: number;
        url: string;
        parent:number;
    }
    userId: string
}) {

    const insert =  await db.insert(files_table).values({
        ...input.file,
        ownerId: input.userId
    })

    console.log(insert)

    return insert
}


export async function onBoardUser(userId: string) {
    const rootFolder = await db.insert(foldersSchema).values({
        name:"root",
        ownerId:userId,
        parent:null,
    }).$returningId()

    const rootFolderId = rootFolder[0]!.id;

    await db.insert(foldersSchema).values([
        {
          name: "Trash",
          parent: rootFolderId,
          ownerId: userId,
        },
        {
          name: "Shared",
          parent: rootFolderId,
          ownerId: userId,
        },
        {
          name: "Documents",
          parent: rootFolderId,
          ownerId: userId,
        },
      ]);
  
      return rootFolderId;
} 