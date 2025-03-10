"use client"

/**
 * Blog Component
 *
 * A full-featured blog application with:
 * - Post listing, creation, editing, and deletion
 * - Search functionality
 * - Bookmarking system
 * - Dark mode toggle
 * - Pagination
 */

import { useEffect, useState } from "react"
import { fetchPosts, createPost, updatePost, deletePost, searchPosts, type Post } from "./api/api"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Bookmark, Moon, Sun, Search } from "lucide-react"
import { PostCard } from "@/components/post-card"
import { SearchBar } from "@/components/search-bar"
import { PostModal } from "@/components/post-modal"
import { ViewPostModal } from "@/components/view-post-modal"
import { EmptyState } from "@/components/empty-state"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function Blog() {
  // Main state
  const [posts, setPosts] = useState<Post[]>([])
  // State for managing the main post data and filtered views
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
  const [isSearching, setIsSearching] = useState(false)
  // State for managing search functionality
  const [searchResults, setSearchResults] = useState<Post[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  // State for managing modal interactions
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editingPostId, setEditingPostId] = useState<number | null>(null)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  // Form state
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    author_name: "",
  })
  // State for form data when creating or editing posts

  // Preferences
  const [darkMode, setDarkMode] = useState(false)
  // User preference state (persisted in localStorage)
  const [bookmarkedPosts, setBookmarkedPosts] = useLocalStorage<number[]>("bookmarkedPosts", [])

  // Constants
  const POSTS_PER_PAGE = 4
  // Configuration constants

  // Initialize app
  useEffect(() => {
    loadPosts()
    initializeDarkMode()
  }, [])
  // Initial app setup on component mount

  // Filter posts based on active tab
  useEffect(() => {
    let result = [...posts]
    if (activeTab === "bookmarked") {
      result = result.filter((post) => bookmarkedPosts.includes(post.id))
    }
    setFilteredPosts(result)
  }, [posts, activeTab, bookmarkedPosts])
  // Filter posts whenever the active tab, posts list, or bookmarks change

  // Initialize dark mode based on system preference
  const initializeDarkMode = () => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }
  // Set initial dark mode based on user's system preference

  // Fetch posts from API
  const loadPosts = async () => {
    try {
      const data = await fetchPosts()
      setPosts(data)
      setFilteredPosts(data)
    } catch {
      setError("Failed to fetch posts. Please try again.")
    }
  }
  // Fetch posts from the API and handle errors

  // Search functionality
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    try {
      // Try API search, fall back to client-side if needed
      let results
      try {
        results = await searchPosts(searchTerm)
      } catch (error) {
        console.warn("API search failed, falling back to client-side search:", error)
        results = posts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      setSearchResults(results)
    } catch (error) {
      console.error("Search failed:", error)
      setError("Search failed. Please try again.")
    }
  }
  // Search functionality with API fallback to client-side search

  // Post CRUD operations
  const handleCreate = async () => {
    if (!newPost.title || !newPost.content || !newPost.author_name) {
      setError("All fields are required")
      return
    }
    try {
      const createdPost = await createPost(newPost)
      setPosts([createdPost, ...posts])
      closeModal()
    } catch {
      setError("Failed to create post.")
    }
  }
  // CRUD Operations - Create new post

  const handleEdit = (post: Post) => {
    setEditingPostId(post.id)
    setNewPost({
      title: post.title,
      content: post.content,
      author_name: post.author_name,
    })
    setIsModalOpen(true)
    setError(null)
  }
  // CRUD Operations - Prepare post for editing

  const handleUpdate = async () => {
    if (!newPost.title || !newPost.content || !newPost.author_name || editingPostId === null) {
      setError("All fields are required")
      return
    }
    try {
      const updatedPost = await updatePost(editingPostId, newPost)
      setPosts(posts.map((post) => (post.id === editingPostId ? updatedPost : post)))
      closeModal()
    } catch {
      setError("Failed to update post.")
    }
  }
  // CRUD Operations - Update existing post

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id)
      setPosts(posts.filter((post) => post.id !== id))
      if (bookmarkedPosts.includes(id)) {
        setBookmarkedPosts(bookmarkedPosts.filter((postId) => postId !== id))
      }
    } catch {
      setError("Failed to delete post.")
    }
  }
  // CRUD Operations - Delete post and remove from bookmarks if needed

  // Modal handlers
  const openModalForCreate = () => {
    setNewPost({ title: "", content: "", author_name: "" })
    setEditingPostId(null)
    setIsModalOpen(true)
    setError(null)
  }
  // Modal management - Open modal for creating new post

  const closeModal = () => {
    setIsModalOpen(false)
    setNewPost({ title: "", content: "", author_name: "" })
    setEditingPostId(null)
    setError(null)
  }
  // Modal management - Close and reset create/edit modal

  const openViewModal = (post: Post) => {
    setSelectedPost(post)
    setViewModalOpen(true)
  }
  // Modal management - Open modal for viewing post details

  const closeViewModal = () => {
    setViewModalOpen(false)
    setSelectedPost(null)
  }
  // Modal management - Close view modal

  // Utility functions
  const toggleBookmark = (postId: number) => {
    setBookmarkedPosts(
      bookmarkedPosts.includes(postId) ? bookmarkedPosts.filter((id) => id !== postId) : [...bookmarkedPosts, postId],
    )
  }
  // Utility - Toggle bookmark status for a post

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }
  // Utility - Toggle dark mode and update DOM

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    return Math.max(1, Math.ceil(words / wordsPerMinute))
  }
  // Utility - Calculate estimated reading time based on content length

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  // Utility - Format date strings for display

  // Pagination
  const featuredPosts = filteredPosts.slice(0, 3)
  const recentPosts = filteredPosts.slice(3)
  const indexOfLastPost = currentPage * POSTS_PER_PAGE
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE
  const paginatedPosts = recentPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(recentPosts.length / POSTS_PER_PAGE)
  // Pagination and content organization

  // Clear search
  const clearSearch = () => {
    setIsSearching(false)
    setSearchTerm("")
    setSearchResults([])
  }
  // Utility - Reset search state

  // UI Rendering - Main component structure with responsive layout
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg"></div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">BlogSpace</h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Search component */}
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                posts={posts}
                onSearch={handleSearch}
                setSearchResults={setSearchResults}
                setIsSearching={setIsSearching}
              />

              <Button onClick={openModalForCreate} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">New Post</span>
              </Button>

              <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full h-9 w-9">
                {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-700" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
        {/* Error display */}
        {error && (
          <Alert variant="destructive" className="mb-8 border-0 bg-red-100 dark:bg-red-900/30">
            <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {/* Search results */}
        {isSearching ? (
          <div>
            {searchResults.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Search Results for "{searchTerm}" ({searchResults.length})
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSearch}
                    className="bg-white text-black border-black dark:bg-black dark:text-white dark:border-white"
                  >
                    Clear Search
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onEdit={() => handleEdit(post)}
                      onDelete={() => handleDelete(post.id)}
                      formatDate={formatDate}
                      calculateReadingTime={calculateReadingTime}
                      isBookmarked={bookmarkedPosts.includes(post.id)}
                      onBookmarkToggle={() => toggleBookmark(post.id)}
                      onCardClick={() => openViewModal(post)}
                      variant="featured"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                icon={<Search className="h-10 w-10 text-gray-400" />}
                title="No results found"
                description={`We couldn't find any posts matching "${searchTerm}". Try a different search term.`}
                actionLabel="View All Posts"
                onAction={clearSearch}
              />
            )}
          </div>
        ) : (
          <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-black-100 dark:bg-gray-800">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  All Posts
                </TabsTrigger>
                <TabsTrigger
                  value="bookmarked"
                  className="data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  Bookmarked
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              {/* Featured Posts Section */}
              {featuredPosts.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Posts</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuredPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onEdit={() => handleEdit(post)}
                        onDelete={() => handleDelete(post.id)}
                        formatDate={formatDate}
                        calculateReadingTime={calculateReadingTime}
                        isBookmarked={bookmarkedPosts.includes(post.id)}
                        onBookmarkToggle={() => toggleBookmark(post.id)}
                        onCardClick={() => openViewModal(post)}
                        variant="featured"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Posts Section */}
              {paginatedPosts.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Posts</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {paginatedPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onEdit={() => handleEdit(post)}
                        onDelete={() => handleDelete(post.id)}
                        formatDate={formatDate}
                        calculateReadingTime={calculateReadingTime}
                        isBookmarked={bookmarkedPosts.includes(post.id)}
                        onBookmarkToggle={() => toggleBookmark(post.id)}
                        onCardClick={() => openViewModal(post)}
                        variant="recent"
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 0 && (
                    <div className="flex justify-center mt-10">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                          key={i}
                          variant={currentPage === i + 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-9 h-9 p-0 mx-1 ${
                            currentPage === i + 1
                              ? "bg-purple-600 hover:bg-purple-700 text-white border-0"
                              : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {filteredPosts.length === 0 && (
                <EmptyState
                  title="No posts found"
                  description="We couldn't find any posts. Create a new post to get started."
                  actionLabel="Create New Post"
                  onAction={openModalForCreate}
                  icon={<Plus className="h-10 w-10 text-gray-400" />}
                />
              )}
            </TabsContent>

            <TabsContent value="bookmarked" className="mt-0">
              {bookmarkedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onEdit={() => handleEdit(post)}
                      onDelete={() => handleDelete(post.id)}
                      formatDate={formatDate}
                      calculateReadingTime={calculateReadingTime}
                      isBookmarked={true}
                      onBookmarkToggle={() => toggleBookmark(post.id)}
                      onCardClick={() => openViewModal(post)}
                      variant="featured"
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Bookmark className="h-10 w-10 text-gray-400" />}
                  title="No bookmarked posts"
                  description="You haven't bookmarked any posts yet. Browse through the posts and bookmark the ones you want to read later."
                  actionLabel="Browse Posts"
                  onAction={() => setActiveTab("all")}
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Modals */}
      <PostModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        post={newPost}
        setPost={setNewPost}
        onSave={editingPostId ? handleUpdate : handleCreate}
        onClose={closeModal}
        isEditing={!!editingPostId}
        error={error}
      />

      <ViewPostModal
        isOpen={viewModalOpen}
        onOpenChange={setViewModalOpen}
        post={selectedPost}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBookmarkToggle={toggleBookmark}
        isBookmarked={selectedPost ? bookmarkedPosts.includes(selectedPost.id) : false}
        formatDate={formatDate}
        calculateReadingTime={calculateReadingTime}
      />
    </div>
  )
}

