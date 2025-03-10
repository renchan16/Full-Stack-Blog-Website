import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import type { Post } from "../api/api"

type SearchBarProps = {
  searchTerm: string
  setSearchTerm: (term: string) => void
  posts: Post[]
  onSearch: () => void
  setSearchResults: (results: Post[]) => void
  setIsSearching: (isSearching: boolean) => void
}

/**
 * Search bar component with suggestions
 */
export function SearchBar({
  searchTerm,
  setSearchTerm,
  posts,
  onSearch,
  setSearchResults,
  setIsSearching,
}: SearchBarProps) {
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])

  // Generate search suggestions based on input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    if (value.trim()) {
      // Find matching post titles for suggestions
      const suggestions = posts
        .filter(
          (post) =>
            post.title.toLowerCase().includes(value.toLowerCase()) ||
            post.content.toLowerCase().includes(value.toLowerCase()),
        )
        .slice(0, 5)
        .map((post) => post.title)

      // Remove duplicates
      setSearchSuggestions([...new Set(suggestions)])
    } else {
      setSearchSuggestions([])
      setSearchResults([])
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion)
    setSearchSuggestions([])

    // Filter posts based on the selected suggestion
    const results = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(suggestion.toLowerCase()) ||
        post.content.toLowerCase().includes(suggestion.toLowerCase()),
    )

    setSearchResults(results)
    setIsSearching(true)
  }

  return (
    <div className="relative w-56 md:w-64">
      <div className="relative">
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search posts..."
          className="pr-10 h-9 border-gray-300 text-black dark:text-white border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-full"
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
        <Button
          onClick={onSearch}
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full rounded-r-full text-gray-500"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {searchSuggestions.length > 0 && (
        <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          {searchSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center text-black dark:text-white"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <Search className="h-3.5 w-3.5 mr-2 text-gray-500" />
              <span className="text-sm truncate">{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

