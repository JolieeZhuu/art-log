import { React, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Controller } from "../entities.js";
import '../loginsignup.css';

export default function Login() {
    const admins = new Map();
    const requests = new Controller();
    const adminUrl = 'http://localhost:8080/admin/';
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isMatching, setIsMatching] = useState(true);

    requests.getAll(adminUrl)
    .then(data => {
        data.forEach((admin) => {
            admins.set(admin.username, admin.password);
        })
    })

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        if (admins.get(username) === password) {
            setIsMatching(true);
            setTimeout(() => {
                navigate(`/students`);
            }, 100);
        } else {
            setIsMatching(false);
            console.log('username or password is incorrect'); // DEBUG
            setUsername("");
            setPassword("");
        }
    }

    return (
        <div className="container">
            <div className="login-rectangle">
                <img src="/artloglogo.png" alt="Art Log Logo" />
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form">
                        <input className='input' name='username' placeholder='Username' value={username} onChange={e => setUsername(e.target.value)}/>
                        <input className='input' type="password" name='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
                        <button className='button' type="submit">Login</button>
                        {!isMatching && (
                            <p className="warning-message">Username or password is incorrect</p>
                        )}
                        <p>Don't have an account? <Link className="colour" to="/signup">Signup</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}