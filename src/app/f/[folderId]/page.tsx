import { auth } from "@clerk/nextjs/server";
import DriveContents from "./drive-contents";
import { getFiles, getFolders, getAllParentsForFolder, getFolderById } from "~/server/db/queries";


export default async function GoogleDriveClone(props: {
    params: Promise<{ folderId: string }>
}) {
    const params = await props.params

    const parsedFolderId = parseInt(params.folderId)

    if (isNaN(parsedFolderId)) {
        return <div>Invalid folder ID</div>
    }

    const user = await auth()

    const currentFolder = await getFolderById(parsedFolderId)

    if(user.userId !== currentFolder?.ownerId){
        return (
            <div>You are not allowed to see this folder.</div>
        )
    }
   
    const foldersPromise = getFolders(parsedFolderId)

    const filesPromise = getFiles(parsedFolderId)

    const parentsPromise = getAllParentsForFolder(parsedFolderId)

    const [folders, files, parents] = await Promise.all([foldersPromise, filesPromise, parentsPromise])

    return (
        <DriveContents files={files} folders={folders} parents={parents} currentFolderId={parsedFolderId} currentUser={user.userId}/>
    )
}
