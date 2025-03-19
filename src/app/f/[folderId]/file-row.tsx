import type { File, Folder } from "../../../lib/mock-data"
import { Folder as FolderIcon, FileIcon, Upload, ChevronRight, Trash2Icon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Progress } from "~/components/ui/progress"
import { deleteFile, deleteFolder } from "~/server/actions"
import type { files_table, folders_table } from "~/server/db/schema"


export function FileRow(props: { file: typeof files_table.$inferSelect }) {

    const [deleteProgress, setDeleteProgress] = useState(0)
    const { file } = props

    const handleDeleteFile = async (fileId: number) => {
        const interval = setInterval(() => {
            setDeleteProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                }

                const increment = Math.random() * 10 + 5
                const newProgress = Math.min(prev + increment, 100)

                return newProgress
            })
        }, 200)
        try {
            await deleteFile(fileId)
            clearInterval(interval)
            setDeleteProgress(100)
        } catch (error) {
            console.error("Error deleting file:", error)
        } finally {
            clearInterval(interval)
            setDeleteProgress(0)
        }
    }

    return (
        <>
            <li key={file.id} className="px-6 py-4 border-b border-gray-700 hover:bg-gray-750">
                <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-6 flex items-center">
                        <a href={file.url} className="flex items-center text-gray-100 hover:text-blue-400" target="_blank">
                            <FileIcon className="mr-3" size={20} />
                            {file.name}
                        </a>
                    </div>
                    <div className="col-span-2 text-gray-400">{"File"}</div>
                    <div className="col-span-3 text-gray-400">{file.size}</div>
                    <div className="col-span-1 text-gray-400">
                        <Button variant={"ghost"} onClick={() => handleDeleteFile(file.id)} aria-label="Delete file">
                            <Trash2Icon size={20}></Trash2Icon>
                        </Button>
                    </div>
                </div>
            </li>
            {
                deleteProgress !== 0 && <Progress value={deleteProgress} className="w-[100%]" />
            }
        </>
    )
}

export function FolderRow(props: { folder: typeof folders_table.$inferSelect }) {

    const [deleteProgress, setDeleteProgress] = useState(0)
    const { folder } = props

    const handleDeleteFolder = async (folderId: number) => {
        const interval = setInterval(() => {
            setDeleteProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                }

                const increment = Math.random() * 10 + 5
                const newProgress = Math.min(prev + increment, 100)

                return newProgress
            })
        }, 100)
        try {
            await deleteFolder(folderId)
            clearInterval(interval)
            setDeleteProgress(100)
        } catch (error) {
            console.error("Error deleting file:", error)
        } finally {
            clearInterval(interval)
            setDeleteProgress(0)
        }
    }

    return (
        <>
            <li key={folder.id} className="px-6 py-4 border-b border-gray-700 hover:bg-gray-750">
                <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-6 flex items-center">
                        <Link
                            href={`/f/${folder.id}`}
                            className="flex items-center text-gray-100 hover:text-blue-400"
                        >
                            <FolderIcon className="mr-3" size={20} />
                            {folder.name}
                        </Link>
                    </div>
                    <div className="col-span-2 text-gray-400">{"Folder"}</div>
                    <div className="col-span-3 text-gray-400"></div>
                    <div className="col-span-1 text-gray-400">
                        <Button variant={"ghost"} onClick={() => handleDeleteFolder(folder.id)} aria-label="Delete file">
                            <Trash2Icon size={20}></Trash2Icon>
                        </Button>
                    </div>
                </div>
            </li>
            {
                deleteProgress !== 0 && <Progress value={deleteProgress} className="w-[100%]" />    
            }
        </>
    )
}