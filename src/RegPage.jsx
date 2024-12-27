import axios from "axios";
import {useState} from "react";
import { useNavigate } from "react-router-dom";

export function RegisterPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [full_name, setFull_name] = useState('')

    let navigate = useNavigate();

    async function handleReg() {
        try{
            const response
                = await axios.post('http://localhost:8000/api/register', {username, password, full_name})
            console.log(response)
        }
        catch (error) {
            alert("This login is already taken")
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
            <p>Name: </p>
            <input value={full_name}
                   onChange={(e) => setFull_name(e.target.value)}
                   type='text'
                   id='full_name'/>
        </form>
        <button onClick={handleReg}>Register</button>
        <button onClick={e => navigate('/login')}>To Login page</button>
    </>)
}