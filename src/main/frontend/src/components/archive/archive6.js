import { React, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller } from '../../restAPI/entities.js';
import '../loginsignup.css';

export default function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [isFilled, setIsFilled] = useState(true);

    const navigate = useNavigate();
    const adminUrl = 'http://localhost:8080/admin/';
    const requests = new Controller();

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
        if (firstName === '' || lastName === '' || username === '' || password === '' || role === '') {
            setIsFilled(false);
        } else {     
            setIsFilled(true);   
            const data = {
                first_name: firstName,
                last_name: lastName,
                username: username,
                password: password,
                role: role
            }

            requests.add(adminUrl, data)
                .then(() => {
                    setTimeout(() => {
                        setFirstName("");
                        setLastName("");
                        setUsername("");
                        setPassword("");
                        setRole("");
                        navigate(`/`);
                    }, 100);
                })

            }
    }

    return (
        <div className="container">
            <div className="signup-rectangle">
                <h1 className="center-text">Signup</h1>
                <form onSubmit={handleSubmit}>
                    <div  className="form">
                        <input className='center-element input' name='firstName' placeholder='First Name' value={firstName} onChange={e => setFirstName(e.target.value)}/>
                        <input className='center-element input' name='lastName' placeholder='Last Name' value={lastName} onChange={e => setLastName(e.target.value)}/>
                        <input className='center-element input' name='username' placeholder='Username' value={username} onChange={e => setUsername(e.target.value)}/>
                        <input className='center-element input' type="password" name='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
                        <input className='center-element input' name='role' placeholder='Role' value={role} onChange={e => setRole(e.target.value)}/>
                        {!isFilled && (
                            <p className="warning-message">Please fill in all fields</p>
                        )}
                        <button className='center-element button' type="submit">Signup</button>
                    </div>
                </form>
            </div>
        </div>
    );
}