import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, User, Clock, Calendar, BookmarkCheck, Bookmark } from "lucide-react"
import type { Post } from "../api/api"

type ViewPostModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
  onEdit: (post: Post) => void
  onDelete: (id: number) => void
  onBookmarkToggle: (id: number) => void
  isBookmarked: boolean
  formatDate: (date: string) => string
  calculateReadingTime: (content: string) => number
}

/**
 * Modal for viewing post details
 */
export function ViewPostModal({
  isOpen,
  onOpenChange,
  post,
  onEdit,
  onDelete,
  onBookmarkToggle,
  isBookmarked,
  formatDate,
  calculateReadingTime,
}: ViewPostModalProps) {
  if (!post) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 shadow-xl rounded-xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white">{post.title}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBookmarkToggle(post.id)}
              className={`h-9 w-9 p-0 ${
                isBookmarked ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {isBookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{post.author_name}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{calculateReadingTime(post.content)} min read</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(post.date_posted)}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="w-full h-[200px] bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg mb-6 flex items-center justify-center">
            <span className="text-6xl text-white font-bold">{post.title.charAt(0)}</span>
          </div>

          <div className="prose prose-purple dark:prose-invert max-w-none">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index} className="text-gray-700 dark:text-gray-300 mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center border-t border-gray-200 dark:border-gray-800 pt-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(post)}
              className="text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Post
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this post?")) {
                  onDelete(post.id)
                  onOpenChange(false)
                }
              }}
              className="text-red-600 dark:text-red-500 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black hover:border-purple-600 dark:hover:border-purple-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Post
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

