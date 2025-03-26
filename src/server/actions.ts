"use server";
import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { files_table, folders_table } from "./db/schema";
import { UTApi } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { getFileById } from "./db/queries";

const utApi = new UTApi()

export async function deleteFile(fileId: number) {
    const session = await auth()

    if (!session.userId) {
        return { error: "Unauthorized" }
    }

    const [file] = await db
        .select()
        .from(files_table)
        .where(and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)))

    if (!file) {
        return { error: "File not found" }
    }

    const utApiResult = await utApi.deleteFiles([file?.url.replace("https://utfs.io/f/", "")])

    await db.delete(files_table).where(eq(files_table.id, fileId))

    const c = await cookies()

    c.set("force-refresh", JSON.stringify(Math.random()))

    return { success: true }
}

export async function updateFileName(params: {itemId:number, newName:string}){

    const {itemId,newName} = params

    const file = await getFileById(itemId)

    await db.update(files_table).set({name: newName}).where(eq(files_table.id,itemId))

    const key = file?.url.replace("https://utfs.io/f/", "") as string
    
    utApi.renameFiles({
        fileKey:  key,
        newName
    })
}

export async function createFolder(
  input: {
    folder: { name: string; parent: number };
    userId: string;
  }): Promise<void>{
    const { folder, userId } = input;

    await db.insert(folders_table).values({
        ...folder,
        ownerId: userId
    })
}

export async function updateFolderName(params: {itemId:number, newName:string}){

    const { itemId, newName } = params

    await db
        .update(folders_table)
        .set({name:newName})
        .where(eq(folders_table.id,itemId));
        
}


export async function deleteFolder(folderId: number) {
    const session = await auth()

    if (!session.userId) {
        return { error: "Unauthorized" }
    }

    const [folder] = await db
        .select()
        .from(folders_table)
        .where(and(eq(folders_table.id, folderId), eq(folders_table.ownerId, session.userId)))

    if (!folder) {
        return { error: "Folder not found" }
    }

    try {
        const foldersToDelete = await db
            .select()
            .from(folders_table)
            .where(eq(folders_table.parent, folderId))

        const filesToDelete = await db
            .select()
            .from(files_table)
            .where(eq(files_table.parent, folderId))


        foldersToDelete.forEach((folder) => {
            deleteFolder(folder.id)
        })

        filesToDelete.forEach((file) => {
            deleteFile(file.id)
        })
    } catch (error) {
        console.log(error)
        return { success: false }
    }

    await db.delete(folders_table).where(eq(folders_table.id, folderId))

    const c = await cookies()

    c.set("force-refresh", JSON.stringify(Math.random()))

    return { success: true }
}