import {useLocation} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {useCredentialsStore} from "./store.js";

export function UserPage() {

    const location = useLocation();
    const { username, full_name, posts } = location.state || {};

    let navigate = useNavigate();

    const [userPosts, setUserPosts] = useState([])

    const credentials = useCredentialsStore((state) => state.credentials);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const response
                    = await axios.get(`http://localhost:8000/api/users/${username}/posts`, {
                    headers: {
                        'Authorization': `Basic ${credentials}`
                    }
                });
                setUserPosts(response.data);
                console.log(response.data);
            } catch (error) {
                if (error.response.status === 404) {
                    console.log(error.response.status)
                }
            }
        };

        getPosts();
    }, [username, credentials]);

    async function handleLike(postId) {
        try {
            const response = await axios.put(
                `http://localhost:8000/api/users/${username}/posts/${postId}/like`,
                {},
                {
                    headers: {
                        'Authorization': `Basic ${credentials}`
                    }
                }
            );
            if (response.status === 201) {
                setUserPosts(prevPosts => prevPosts.map(post => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            likes: post.likes + 1,
                            is_liked: true
                        };
                    }
                    return post;
                }));
            }
        } catch (error) {
            if (error.response.status === 401) {
                alert("You are not logged in")
            }
            if (error.response.status === 404) {
                alert("404 Post not found")
            }
            if (error.response.status === 422) {
                alert("Invalid characters")
            }
        }
    }

    async function handleDislike(postId) {
        try {
            const response = await axios.delete(
                `http://localhost:8000/api/users/${username}/posts/${postId}/like`,
                {
                    headers: {
                        'Authorization': `Basic ${credentials}`
                    }
                }
            );
            if (response.status === 204) {
                setUserPosts(prevPosts => prevPosts.map(post => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            likes: post.likes - 1,
                            is_liked: false
                        };
                    }
                    return post;
                }));
            }
        } catch (error) {
            if (error.response.status === 401) {
                alert("You are not logged in")
            }
            if (error.response.status === 404) {
                alert("404 Post not found")
            }
            if (error.response.status === 422) {
                alert("Invalid characters")
            }
        }
    }

    async function handleRead(postId){
        try {
            const response = await axios.get(
                `http://localhost:8000/api/users/${username}/posts/${postId}`,
                {
                    headers: {
                        'Authorization': `Basic ${credentials}`
                    }
                }
            );
            if (response.status === 200) {
                navigate(`${postId}/read`, {state: {content: response.data.content}});
            }
        } catch (error) {
            if (error.response.status === 404) {
                alert("404 Post not found")
            }
            if (error.response.status === 422) {
                alert("Invalid characters")
            }
        }
    }

    return (<>
        <div className="user-data">
            <p>Username: {username}</p>
            <p>Full Name: {full_name}</p>
            <p>Posts: {posts}</p>
        </div>

        {userPosts.map(post => (
            <div className="post" key={post.id}>
                {post.content}
                <hr/>
                <button onClick={() => handleRead(post.id)}>Read</button>
                Likes: {post.likes}
                <button
                    className="like-btn"
                    onClick={() => post.is_liked ? handleDislike(post.id) : handleLike(post.id)}>
                    {post.is_liked ? 'Unlike' : 'Like'}
                </button>
            </div>
        ))}
    </>)
}