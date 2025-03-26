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

interface ModalProps {
  trigger?: React.ReactNode;
  currentUser:string;
  currentFolderId: number;
  onConfirm: (params:{itemId:number, newName:string}) => Promise<void>,
  currentFileId:number;
  size?:number;
} 


export function EditModal({ trigger, currentUser, currentFolderId, currentFileId, onConfirm, size }: ModalProps) {
  const [editName, setEditName] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate folder name
    if (!editName.trim()) {
      setError("Folder name cannot be empty")
      return
    }

    if (/[<>:"/\\|?*]/.test(editName)) {
      setError("Folder name contains invalid characters")
      return
    }

    try {
      setIsLoading(true)

      // Here you would typically call your API to create the folder
      // For example:
      await onConfirm({
        itemId:currentFileId,
        newName:editName
      })
      // Reset form and close modal
      setEditName("")
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
            {"Submit"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update {size ? "file" : "folder"} name</DialogTitle>
          <DialogDescription>Enter a new name for your {size ? "file" : "folder"}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editName">{size ? "File" : "Folder"} name</Label>
              <Input
                id="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Untitled name"
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
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

