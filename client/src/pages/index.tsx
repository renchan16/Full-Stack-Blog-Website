"use client"

import { useEffect, useState } from "react"
import { fetchPosts, createPost, updatePost, deletePost, type Post } from "./api/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Trash2, Plus, Clock, Calendar, User, Bookmark, BookmarkCheck, Moon, Sun } from "lucide-react"

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    author_name: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [editingPostId, setEditingPostId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [darkMode, setDarkMode] = useState(false)
  const [bookmarkedPosts, setBookmarkedPosts] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)

  const postsPerPage = 4

  useEffect(() => {
    loadPosts()

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }

    const savedBookmarks = localStorage.getItem("bookmarkedPosts")
    if (savedBookmarks) {
      setBookmarkedPosts(JSON.parse(savedBookmarks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("bookmarkedPosts", JSON.stringify(bookmarkedPosts))
  }, [bookmarkedPosts])

  useEffect(() => {
    let result = [...posts]

    if (activeTab === "bookmarked") {
      result = result.filter((post) => bookmarkedPosts.includes(post.id))
    }

    setFilteredPosts(result)
  }, [posts, activeTab, bookmarkedPosts])

  const loadPosts = async () => {
    try {
      const data = await fetchPosts()
      setPosts(data)
      setFilteredPosts(data)
    } catch {
      setError("Failed to fetch posts. Please try again.")
    }
  }

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

  const openModalForCreate = () => {
    setNewPost({ title: "", content: "", author_name: "" })
    setEditingPostId(null)
    setIsModalOpen(true)
    setError(null)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setNewPost({ title: "", content: "", author_name: "" })
    setEditingPostId(null)
    setError(null)
  }

  const toggleBookmark = (postId: number) => {
    if (bookmarkedPosts.includes(postId)) {
      setBookmarkedPosts(bookmarkedPosts.filter((id) => id !== postId))
    } else {
      setBookmarkedPosts([...bookmarkedPosts, postId])
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (darkMode) {
      document.documentElement.classList.remove("dark")
    } else {
      document.documentElement.classList.add("dark")
    }
  }

  const openViewModal = (post: Post) => {
    setSelectedPost(post)
    setViewModalOpen(true)
  }

  const closeViewModal = () => {
    setViewModalOpen(false)
    setSelectedPost(null)
  }

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    const time = Math.ceil(words / wordsPerMinute)
    return time < 1 ? 1 : time
  }

  const featuredPosts = filteredPosts.slice(0, 3)
  const recentPosts = filteredPosts.slice(3)

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const paginatedPosts = recentPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(recentPosts.length / postsPerPage)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300`}>
      {/* Header with navigation */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg"></div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">BlogSpace</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Button onClick={openModalForCreate} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="h-5 w-5 mr-2" />
              New Post
            </Button>

            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full h-9 w-9">
              {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-700" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
        {error && (
          <Alert variant="destructive" className="mb-8 border-0 bg-red-100 dark:bg-red-900/30">
            <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {/* Tabs for filtering */}
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
                    <FeaturedPostCard
                      key={post.id}
                      post={post}
                      onEdit={() => handleEdit(post)}
                      onDelete={() => handleDelete(post.id)}
                      formatDate={formatDate}
                      calculateReadingTime={calculateReadingTime}
                      isBookmarked={bookmarkedPosts.includes(post.id)}
                      onBookmarkToggle={() => toggleBookmark(post.id)}
                      onCardClick={() => openViewModal(post)}
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
                    <RecentPostCard
                      key={post.id}
                      post={post}
                      onEdit={() => handleEdit(post)}
                      onDelete={() => handleDelete(post.id)}
                      formatDate={formatDate}
                      calculateReadingTime={calculateReadingTime}
                      isBookmarked={bookmarkedPosts.includes(post.id)}
                      onBookmarkToggle={() => toggleBookmark(post.id)}
                      onCardClick={() => openViewModal(post)}
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
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No posts found</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  We couldn't find any posts. Create a new post to get started.
                </p>
                <Button onClick={openModalForCreate} className="bg-purple-600 hover:bg-purple-700 text-white mt-6">
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Post
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookmarked" className="mt-0">
            {bookmarkedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <FeaturedPostCard
                    key={post.id}
                    post={post}
                    onEdit={() => handleEdit(post)}
                    onDelete={() => handleDelete(post.id)}
                    formatDate={formatDate}
                    calculateReadingTime={calculateReadingTime}
                    isBookmarked={true}
                    onBookmarkToggle={() => toggleBookmark(post.id)}
                    onCardClick={() => openViewModal(post)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No bookmarked posts</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  You haven't bookmarked any posts yet. Browse through the posts and bookmark the ones you want to read
                  later.
                </p>
                <Button
                  onClick={() => setActiveTab("all")}
                  className="bg-purple-600 hover:bg-purple-700 text-white mt-6"
                >
                  Browse Posts
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Create/Edit Post Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[650px] bg-white dark:bg-gray-900 shadow-xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {editingPostId ? "Edit Post" : "Create New Post"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">{error}</p>}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <Input
                placeholder="Enter post title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="border-gray-300 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-700 dark:placeholder-gray-400 text-black dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
              <Input
                placeholder="Enter author name"
                value={newPost.author_name}
                onChange={(e) => setNewPost({ ...newPost, author_name: e.target.value })}
                className="border-gray-300 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-700 dark:placeholder-gray-400 text-black dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
              <Textarea
                placeholder="Write your post content here..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows={8}
                className="border-gray-300 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-700 dark:placeholder-gray-400 text-black dark:text-white"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={closeModal}
              className="bg-white text-black hover:text-gray-900 border-gray-300 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={editingPostId ? handleUpdate : handleCreate}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {editingPostId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Post Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 shadow-xl rounded-xl">
          {selectedPost && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                    {selectedPost.title}
                  </DialogTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBookmark(selectedPost.id)}
                    className={`h-9 w-9 p-0 ${
                      bookmarkedPosts.includes(selectedPost.id)
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {bookmarkedPosts.includes(selectedPost.id) ? (
                      <BookmarkCheck className="h-5 w-5" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{selectedPost.author_name}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{calculateReadingTime(selectedPost.content)} min read</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(selectedPost.date_posted)}</span>
                  </div>
                </div>
              </DialogHeader>

              <div className="py-4">
                <div className="w-full h-[200px] bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg mb-6 flex items-center justify-center">
                  <span className="text-6xl text-white font-bold">{selectedPost.title.charAt(0)}</span>
                </div>

                <div className="prose prose-purple dark:prose-invert max-w-none">
                  {selectedPost.content.split("\n").map((paragraph, index) => (
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
                    onClick={() => {
                      closeViewModal()
                      handleEdit(selectedPost)
                    }}
                    className="text-white bg-purple-600 hover: text-white bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Post
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this post?")) {
                        closeViewModal()
                        handleDelete(selectedPost.id)
                      }
                    }}
                    className="text-red-600 dark:text-red-500 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black hover:border-purple-600 dark:hover:border-purple-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Post
                  </Button>
                </div>
              </DialogFooter>


            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Featured Post Card Component
function FeaturedPostCard({
  post,
  onEdit,
  onDelete,
  formatDate,
  calculateReadingTime,
  isBookmarked,
  onBookmarkToggle,
  onCardClick,
}: {
  post: Post
  onEdit: () => void
  onDelete: () => void
  formatDate: (date: string) => string
  calculateReadingTime: (content: string) => number
  isBookmarked: boolean
  onBookmarkToggle: () => void
  onCardClick: () => void
}) {
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
            onClick={onEdit}
            className="h-8 px-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <Edit className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onBookmarkToggle}
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

// Recent Post Card Component
function RecentPostCard({
  post,
  onEdit,
  onDelete,
  formatDate,
  calculateReadingTime,
  isBookmarked,
  onBookmarkToggle,
  onCardClick,
}: {
  post: Post
  onEdit: () => void
  onDelete: () => void
  formatDate: (date: string) => string
  calculateReadingTime: (content: string) => number
  isBookmarked: boolean
  onBookmarkToggle: () => void
  onCardClick: () => void
}) {
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
            onClick={(e) => {
              e.stopPropagation()
              onBookmarkToggle()
            }}
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
              onClick={onEdit}
              className="h-8 px-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
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

