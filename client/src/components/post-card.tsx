"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Clock, Calendar, User, Bookmark, BookmarkCheck } from "lucide-react"
import type { Post } from "../api/api"

type PostCardProps = {
  post: Post
  onEdit: () => void
  onDelete: () => void
  formatDate: (date: string) => string
  calculateReadingTime: (content: string) => number
  isBookmarked: boolean
  onBookmarkToggle: () => void
  onCardClick: () => void
  variant: "featured" | "recent"
}

/**
 * Reusable post card component that handles both featured and recent post layouts
 */
export function PostCard({
  post,
  onEdit,
  onDelete,
  formatDate,
  calculateReadingTime,
  isBookmarked,
  onBookmarkToggle,
  onCardClick,
  variant,
}: PostCardProps) {
  // Prevent event bubbling for button clicks
  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation()
    callback()
  }

  // Featured post card (vertical layout)
  if (variant === "featured") {
    return (
      <Card
        className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer"
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest("button")) {
            onCardClick()
          }
        }}
      >
        <div className="h-48 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <span className="text-4xl text-white font-bold">{post.title.charAt(0)}</span>
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">{post.title}</CardTitle>
        </CardHeader>

        <CardContent className="pb-2">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <div className="flex items-center">
              <User className="h-3.5 w-3.5 mr-1" />
              <span>{post.author_name}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{calculateReadingTime(post.content)} min read</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{formatDate(post.date_posted)}</span>
            </div>
          </div>

          <p className="line-clamp-3 text-gray-600 dark:text-gray-300 text-sm">{post.content}</p>
        </CardContent>

        <CardFooter className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleButtonClick(e, onEdit)}
              className="h-8 px-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleButtonClick(e, onDelete)}
              className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Delete
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleButtonClick(e, onBookmarkToggle)}
            className={`h-8 w-8 p-0 ${
              isBookmarked ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Recent post card (horizontal layout)
  return (
    <Card
      className="overflow-hidden transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col md:flex-row cursor-pointer"
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("button")) {
          onCardClick()
        }
      }}
    >
      <div className="md:w-1/3 h-48 md:h-auto bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
        <span className="text-4xl text-white font-bold">{post.title.charAt(0)}</span>
      </div>

      <div className="flex-1 flex flex-col p-5">
        <div className="mb-2 flex items-center justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleButtonClick(e, onBookmarkToggle)}
            className={`h-7 w-7 p-0 ${
              isBookmarked ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </Button>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{post.title}</h3>

        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center">
            <User className="h-3.5 w-3.5 mr-1" />
            <span>{post.author_name}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{calculateReadingTime(post.content)} min read</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{formatDate(post.date_posted)}</span>
          </div>
        </div>

        <p className="line-clamp-2 text-gray-600 dark:text-gray-300 text-sm mb-4">{post.content}</p>

        <div className="mt-auto flex justify-end items-center">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleButtonClick(e, onEdit)}
              className="h-8 px-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleButtonClick(e, onDelete)}
              className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

