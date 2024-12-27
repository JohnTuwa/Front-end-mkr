import {useEffect, useState} from "react";
import axios from "axios";
import { useCredentialsStore} from "./store.js"
import {useNavigate} from "react-router-dom";

export function MePage() {
    const [myName, setMyName] = useState('')
    const [full_name, setFull_name] = useState('')
    const [posts, setPosts] = useState(0)
    const credentials = useCredentialsStore((state) => state.credentials);

    const [username, setUsername] = useState('')

    const [userPosts, setUserPosts] = useState([])

    const [myContent, setMyContent] = useState('')

    let navigate = useNavigate();

    useEffect(() => {
        const getMe = async () => {
            try {
                const response
                    = await axios.get('http://localhost:8000/api/me', {
                    headers: {
                        'Authorization': `Basic ${credentials}`
                    }
                });
                setMyName(response.data.username);
                setFull_name(response.data.full_name);
                setPosts(response.data.posts);
            } catch (error) {
                if (error.response.status === 401) {
                    alert("Please log in")
                }
            }
        };

        getMe();
    }, [credentials]);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const response
                    = await axios.get(`http://localhost:8000/api/users/${myName}/posts`, {
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
    }, [myName, credentials]);

    async function findUser() {
        try {
            const response
                = await axios.get(`http://localhost:8000/api/users/${username}`);
            if (response.status === 200) {
                navigate(`/${username}`, {state: {username: response.data.username,
                                                  full_name: response.data.full_name,
                                                  posts: response.data.posts}});
            }
        } catch (error) {
            if (error.response.status === 404) {
                alert("User with this name doesn't exist")
            }
            if (error.response.status === 422) {
                alert("Invalid characters")
            }
        }
    }

    async function createPost() {
        try {
            const response = await axios.post(
                `http://localhost:8000/api/users/${myName}/posts`,
                { content: myContent },
                {
                    headers: {
                        'Authorization': `Basic ${credentials}`
                    }
                }
            );
            if (response.status === 200) {
                const postsResponse = await axios.get(
                    `http://localhost:8000/api/users/${myName}/posts`,
                    {
                        headers: {
                            'Authorization': `Basic ${credentials}`
                        }
                    }
                );
                setUserPosts(postsResponse.data);
                setMyContent('');
            }
        } catch (error) {
            if (error.response.status === 401) {
                alert("You are not logged in")
            }
            if (error.response.status === 403) {
                alert("You are not allowed to create post")
            }
            if (error.response.status === 422) {
                alert("Invalid characters")
            }
        }
    }

    async function handleLike(postId) {
        try {
            const response = await axios.put(
                `http://localhost:8000/api/users/${myName}/posts/${postId}/like`,
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
                `http://localhost:8000/api/users/${myName}/posts/${postId}/like`,
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
                `http://localhost:8000/api/users/${myName}/posts/${postId}`,
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
        <input type='text'
               placeholder='Find user'
               value={username}
               onChange={(e) => setUsername(e.target.value)}/>
        <button onClick={findUser}>Find</button>
        <hr/>

        <div className="user-data">
            <p>Username: {myName}</p>
            <p>Full Name: {full_name}</p>
            <p>Posts: {posts}</p>
        </div>

        <input type='text'
               placeholder='Post content'
               value={myContent}
               onChange={(e) => setMyContent(e.target.value)}/>
        <button onClick={createPost}>Create post</button>

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