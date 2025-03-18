import { auth } from "@clerk/nextjs/server"
import { mockFiles, mockFolders } from "~/lib/mock-data"
import { db } from "~/server/db"
import { files_table, folders_table } from "~/server/db/schema"


export default function SandBox() {
    return (
        <div className="flex flex-col gap-4">
            Seed function
            <form action={async() => {
                "use server"
                const user = await auth()

                const rootFolder = await db.insert(folders_table).values({
                    name:"root",
                    ownerId:user.userId,
                    parent:null
                }).$returningId()
                
                const insertableFolders = mockFolders.map((folder) => ({
                    name:folder.name,
                    ownerId:user.userId,
                    parent:rootFolder[0]!.id
                }))

                await db.insert(folders_table).values(insertableFolders)

            }}>
                <button type="submit">Seed</button>
            </form>
        </div>
    )
}