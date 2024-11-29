import React, { useContext, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Navigate, useNavigate } from 'react-router';

// React Query could be used like the rest of the application, 
// but I feel like it's not fit for this purpose. 
// It will however be used to keep in sync with the server, but not in authentication.
// Reasoning: https://www.reddit.com/r/reactjs/comments/jd5oxu/comment/g95t6xj/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const user = useAuth();
    const navigate = useNavigate();

    if (user && user!.token) {
        navigate('/user');
    }

    function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        fetch('http://localhost:8080/api/v1/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password })
        }).then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw new Error('Invalid credentials');
            }})
            .then(data => {
                // user?.setToken(data.token);
                console.log(data)
                user!.setUser(data)
            })
            .catch(err => {
                console.error(err);
            })

        // setEmail('');
        // setPassword('');
    }

    return (
        <form className="flex justify-center flex-col p-3 gap-4 md:max-w-96 md:container md:mx-auto" onSubmit={handleLogin}>
            <h1 className="text-center">Log in</h1>
            <p>E-mail</p>
            <input
                type="email"
                className="w-full bg-slate-800 p-2 rounded-sm"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <p>Password</p>
            <input
                type="password"
                className="w-full bg-slate-800 p-2 rounded-sm"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button className="place-self-center w-2/3 my-6 py-2 px-8 bg-green-700">Hallo</button>
        </form>
    )
}