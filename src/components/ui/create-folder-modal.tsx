"use client"

import type React from "react"

import { useState } from "react"
import { Folder } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "./button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
import { Input } from "./input"
import { Label } from "./label"
import { createFolder } from "~/server/actions"

interface CreateFolderModalProps {
  currentUser:string;
  currentFolderId: number;
  trigger?: React.ReactNode
}

export function CreateFolderModal({ currentUser, currentFolderId, trigger }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate folder name
    if (!folderName.trim()) {
      setError("Folder name cannot be empty")
      return
    }

    if (/[<>:"/\\|?*]/.test(folderName)) {
      setError("Folder name contains invalid characters")
      return
    }

    try {
      setIsLoading(true)

      // Here you would typically call your API to create the folder
      // For example:
      await createFolder({
        folder:{
            name:folderName,
            parent:currentFolderId
        },
        userId: currentUser
      })
      // Reset form and close modal
      setFolderName("")
      setIsOpen(false)

      // Refresh the page to show the new folder
      router.refresh()
    } catch (err) {
      setError("Failed to create folder. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Folder className="h-4 w-4" />
            New Folder
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new folder</DialogTitle>
          <DialogDescription>Enter a name for your new folder.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="folderName">Folder name</Label>
              <Input
                id="folderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Untitled folder"
                autoFocus
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

