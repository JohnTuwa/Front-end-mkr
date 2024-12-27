import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { useCredentialsStore} from "./store.js"

export function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const setCredentials =  useCredentialsStore((state) => state.setCredentials);

    let navigate = useNavigate();

    async function handleLogin() {
        try{
            const response
                = await axios.post('http://localhost:8000/api/login', {username, password})
            const encodedCredentials = btoa(`${username}:${password}`);
            setCredentials(encodedCredentials);
            console.log(response);
            navigate('/me');
        }
        catch(error){
            if (error.response.status === 401) {
                alert("Wrong login or password")
            }
            if (error.response.status === 422) {
                alert("Invalid characters in login")
            }
        }
    }
    return(<>
        <form>
            <p>Login: </p>
            <input value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   type='text'
                   id='username'/>
            <p>Password: </p>
            <input value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   type='password'
                   id='password'/>
        </form>
        <button onClick={handleLogin}>Login</button>
    </>)
}