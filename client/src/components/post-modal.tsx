"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type PostModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  post: {
    title: string
    content: string
    author_name: string
  }
  setPost: (post: { title: string; content: string; author_name: string }) => void
  onSave: () => void
  onClose: () => void
  isEditing: boolean
  error: string | null
}

/**
 * Modal for creating and editing posts
 */
export function PostModal({ isOpen, onOpenChange, post, setPost, onSave, onClose, isEditing, error }: PostModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] bg-white dark:bg-gray-900 shadow-xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? "Edit Post" : "Create New Post"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-4">
          {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">{error}</p>}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <Input
              placeholder="Enter post title"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="border-gray-300 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-700 dark:placeholder-gray-400 text-black dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
            <Input
              placeholder="Enter author name"
              value={post.author_name}
              onChange={(e) => setPost({ ...post, author_name: e.target.value })}
              className="border-gray-300 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-700 dark:placeholder-gray-400 text-black dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
            <Textarea
              placeholder="Write your post content here..."
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              rows={8}
              className="border-gray-300 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-700 dark:placeholder-gray-400 text-black dark:text-white"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-white text-black hover:text-gray-900 border-gray-300 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:text-white"
          >
            Cancel
          </Button>
          <Button onClick={onSave} className="bg-purple-600 hover:bg-purple-700 text-white">
            {isEditing ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

