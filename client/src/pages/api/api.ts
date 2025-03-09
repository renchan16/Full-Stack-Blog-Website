import axios from 'axios';

export const searchPosts = async (query: string) => {
    const response = await axios.get(`http://localhost:8000/search/`, {
        params: { query }
    });

    return response.data;
};

const BASE_URL = "http://localhost:8000"

export type Post = {
    id: number
    title: string
    content: string
    author_name: string
    date_posted: string
    image_url?: string
}

// Fetch all posts
export const fetchPosts = async () => {
    const response = await fetch(`${BASE_URL}/posts/`)
    if (!response.ok) throw new Error("Failed to fetch posts")
    return await response.json()
}

// Create post
export const createPost = async (newPost: { title: string; content: string; author_name: string; image_url?: string }) => {
    const response = await fetch(`${BASE_URL}/posts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
    })
    if (!response.ok) throw new Error("Failed to create post")
    return await response.json()
}

// Upload image
export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${BASE_URL}/upload-image/`, {
        method: "POST",
        body: formData,
    })

    if (!response.ok) throw new Error("Failed to upload image")
    const data = await response.json()
    return data.image_url
}

// Update post
export const updatePost = async (id: number, updatedPost: { title: string; content: string; author_name: string; image_url?: string }) => {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
    })
    if (!response.ok) throw new Error("Failed to update post")
    return await response.json()
}

// Delete post
export const deletePost = async (id: number) => {
    const response = await fetch(`${BASE_URL}/posts/${id}`, { method: "DELETE" })
    if (!response.ok) throw new Error("Failed to delete post")
    return await response.json()
}
