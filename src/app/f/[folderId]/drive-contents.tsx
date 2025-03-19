"use client"

import { useMemo, useState } from "react"
import { File, mockFiles, mockFolders } from "../../../lib/mock-data"
import { Folder, FileIcon, Upload, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { FileRow, FolderRow } from "./file-row"
import { files_table, folders_table } from "~/server/db/schema"
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs"
import { UploadButton } from "~/components/uploadthing"
import { useRouter } from "next/navigation"
import { CreateFolderModal } from "~/components/ui/create-folder-modal"
import { toast } from "sonner"
import { Toaster } from "~/components/ui/sonner"

export default function DriveContents(props: {
    files: (typeof files_table.$inferSelect)[];
    folders: (typeof folders_table.$inferSelect)[];
    parents: (typeof folders_table.$inferSelect)[];
    currentFolderId: number;
    currentUser:string;
}) {
    const navigate = useRouter()

    const handleUploadFile = () => {
        navigate.refresh();
        toast.success("File uploaded!", {
            description: "Your file has been successfully uploaded",
            action: {
              label: "OK",
              onClick: () => console.log("OK"),
            },
            classNames:{
                success:"bg-gray-800"
            }
          })
    }

    const handleUploadFilerError = () => {
        toast.error("Error during uploading file", {
            description: "Error occured while uploading file, try later",
            action: {
              label: "OK",
              onClick: () => console.log("OK"),
            },
            classNames:{
                success:"bg-gray-800"
            }
          })
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <Link
                            href={`/drive`}
                            className="text-gray-300 "
                        >
                            My Drive
                        </Link>
                        {props?.parents.map((folder, index) => (
                            <div key={folder.id} className="flex items-center">
                                <ChevronRight className="mx-2 text-gray-500" size={16} />
                                <Link
                                    href={`/f/${folder.id}`}
                                    className="text-gray-300"
                                >
                                    {folder.name}
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center gap-4">
                        <CreateFolderModal currentUser={props.currentUser} currentFolderId={props.currentFolderId}/>
                        <SignedOut>
                            <SignInButton />
                            <SignUpButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-xl">
                    <div className="px-6 py-4 border-b border-gray-700">
                        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
                            <div className="col-span-6">Name</div>
                            <div className="col-span-2">Type</div>
                            <div className="col-span-3">Size</div>
                            <div className="col-span-1">Action</div>
                        </div>
                    </div>
                    <ul>
                        {props.folders.map((folder) => (
                            <FolderRow key={folder.id} folder={folder} />
                        ))}
                        {props.files.map((file) => (
                            <FileRow key={file.id} file={file} />
                        ))}
                    </ul>
                </div>
                <UploadButton   
                    className="mt-5"
                    endpoint="fileUploader"
                    onClientUploadComplete={() => handleUploadFile()}
                    onUploadError={(propss) => handleUploadFilerError()}
                    input={{folderId:props.currentFolderId}}>
                </UploadButton>
            </div>
            <Toaster toastOptions={{style:{ background: '#1f2937'}}}/>
        </div>
    )
}

