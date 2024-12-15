import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { NavLink, useLocation, useNavigate } from 'react-router';
import Notice from '../components/Notice';

// React Query could be used like the rest of the application, 
// but I feel like it's not fit for this purpose. 
// It will however be used to keep in sync with the server, but not in authentication.
// Reasoning: https://www.reddit.com/r/reactjs/comments/jd5oxu/comment/g95t6xj/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const user = useAuth();
    const navigate = useNavigate();

    const { state } = useLocation();

    const [response, setResponse] = useState(state)

    useEffect(() => {
        if (user && user!.getToken()) {
            if (state) {
                navigate(state.redirectAfter);
            } else {
                navigate('/user');
            }
        }
    }, [user, navigate, state]);

    function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        setResponse({ message: 'Logging in...', severity: 'info' });

        fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password })
        }).then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                res.json().then(data => {
                    setResponse({ message: data.error, severity: 'error' });
                });
                throw new Error('Invalid credentials');
            }
        })
            .then(data => {
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
        <form className="flex justify-center flex-col py-8 gap-8 md:max-w-96 md:container md:mx-auto" onSubmit={handleLogin}>
            <h1 className="text-center text-3xl">Log in</h1>
            <div className='border rounded border-slate-500 p-5'>
                <label>E-mail
                    <input
                        type="email"
                        className="w-full bg-slate-800 p-2 my-2 rounded-sm"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>Password
                    <input
                        type="password"
                        className="w-full bg-slate-800 p-2 my-2 rounded-sm"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </label>
            </div>
            {response && <Notice message={response.message} severity={response.severity} />}
            <button className="place-self-center w-2/3 py-2 px-8 bg-blue-500 text-xl">Log in</button>
            <NavLink to="/register" className="text-center text-xl text-gray-400">Create an account instead</NavLink>
            <a href='/SampleUsers.json' className='text-center text-red-600'>👾🤖👾view account credentials👾🤖👾</a>
        </form>
    )
}