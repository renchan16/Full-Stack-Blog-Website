import axios from 'axios';

// Function to search posts based on a query string
export const searchPosts = async (query: string) => {
    const response = await axios.get(`http://localhost:8000/search/`, {
        params: { query } // Sending query as a URL parameter
    });

    return response.data; // Returning search results
};

const BASE_URL = "http://localhost:8000" // Base URL for API endpoints

// Type definition for a Post object
export type Post = {
    id: number
    title: string
    content: string
    author_name: string
    date_posted: string
}

// Fetch all posts from the backend
export const fetchPosts = async () => {
    const response = await fetch(`${BASE_URL}/posts/`)
    if (!response.ok) throw new Error("Failed to fetch posts")
    return await response.json() // Return fetched posts data
}

// Create a new post
export const createPost = async (newPost: { title: string; content: string; author_name: string; image_url?: string }) => {
    const response = await fetch(`${BASE_URL}/posts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // JSON payload for new post data
        body: JSON.stringify(newPost),
    })
    if (!response.ok) throw new Error("Failed to create post")
    return await response.json() // Return the created post data
}


// Update an existing post
export const updatePost = async (id: number, updatedPost: { title: string; content: string; author_name: string; image_url?: string }) => {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }, // JSON payload for updated post data
        body: JSON.stringify(updatedPost),
    })
    if (!response.ok) throw new Error("Failed to update post")
    return await response.json() // Return the updated post data
}

// Delete a post by its ID
export const deletePost = async (id: number) => {
    const response = await fetch(`${BASE_URL}/posts/${id}`, { method: "DELETE" })
    if (!response.ok) throw new Error("Failed to delete post")
    return await response.json() // Return success message or confirmation
}
