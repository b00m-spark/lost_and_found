export const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE || 'http://localhost:5050';
export const API_BASE = `${BACKEND_BASE}/api`;
// TODO, remove try catch => bubble to Signup.jsx/Login.jsx
export async function login({ email, password }) {
    try {
        // define response
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });
        // check if http error status code
        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }
        // parse response body as json
        const loginData = await response.json();
        return loginData;
    } catch (error) {
        console.error('Error during fetch', error);
    }
}

export async function signup({ name, email, password }) {
    
        // define response
        const response = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, email, password })
        });
        // check if http error status code 
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error; status: ${response.status}`);
        }
        // parse response body as json
        const signupData = await response.json();
        return signupData;
    
}

export async function getPosts() {
  try {
    const response = await fetch(`${API_BASE}/posts`);
    if (!response.ok) throw new Error(`HTTP error; status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching posts', error);
    return [];
  }
}

export async function getPostById(id) {
    try {
        const response = await fetch(`${API_BASE}/posts/${id}`);
        if (!response.ok) throw new Error(`HTTP error; status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts', error);
        return null;
    }
}

export async function getMyPosts() {
    try {
        const response = await fetch(`${API_BASE}/posts/me`, {
            method: "GET",
            credentials: "include",
        });
        if (!response.ok) throw new Error(`HTTP error; status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts', error);
        return null;
    }
}

export async function createPost(postData) {
    try {
        const response = await fetch(`${API_BASE}/posts`, {
            method: 'POST',
            body: postData,
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error; status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts', error);
        return null;
    }
}

export async function markResolved(post) {
        const response = await fetch(`${API_BASE}/posts/${post}/resolve`, {
            method: 'PUT',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error; status: ${response.status}`);
        return await response.json();
}

export async function fetchMe() {
  try {
    const res = await fetch(`${API_BASE}/users/me`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching /me:", err);
    return null;
  }
}

export async function deletePost(postId) {
  try {
    const response = await fetch(`${API_BASE}/posts/${postId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Deletion unsuccessful");
    return response.json();
  } catch (err) {
    console.error("Error deleting post:", err);
    return null;
  }
}
