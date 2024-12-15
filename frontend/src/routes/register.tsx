import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { NavLink, useNavigate } from 'react-router';
import Notice from '../components/Notice';

// React Query could be used like the rest of the application, 
// but I feel like it's not fit for this purpose. 
// It will however be used to keep in sync with the server, but not in authentication.
// Reasoning: https://www.reddit.com/r/reactjs/comments/jd5oxu/comment/g95t6xj/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button


export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [username, setUsername] = useState('');
    const [displayname, setDisplayName] = useState('');

    const [response, setResponse] = useState<{ message: string, severity: "info" | "error" | "warning" | "success" }>({ message: '', severity: "info" });

    const user = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user!.getToken()) {
            navigate('/user');
        }
    }, [user, navigate]);
    
    function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        
        setResponse({ message: 'Creating account...', severity: 'info' });

        if(password !== passwordConfirmation) {
            setResponse({ message: 'Passwords do not match', severity: 'warning' });
            return;
        }

        fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password, username: username, displayName: displayname === "" ? username : displayname })
        }).then(res => {
            if (res.status === 201) {
                navigate('/login', { state: { message: 'Account created successfully.\n You can now log in.', severity: 'success' } });
            } else {
                res.json().then(data => {
                    setResponse({ message: data.error, severity: 'error' });
                });
            }
        })
            .catch(err => {
                console.error(err);
            })

        // setEmail('');
        // setPassword('');
    }

    return (
        <form className="flex justify-center flex-col py-8 gap-8 md:max-w-96 md:container md:mx-auto" onSubmit={handleRegister}>
            <h1 className="text-center text-3xl">Register a new account</h1>
            <div className='border rounded border-slate-500 p-5'>
                <h2 className='text-xl mb-4 font-bold'>Your Account</h2>
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
                <label>Confirm password
                    <input
                        type="password"
                        className="w-full bg-slate-800 p-2 my-2 rounded-sm"
                        value={passwordConfirmation}
                        onChange={e => setPasswordConfirmation(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div className='border rounded border-slate-500 p-5'>
                <h2 className='text-xl mb-4 font-bold'>Your Profile</h2>
                <label>Username
                    <input
                        type="text"
                        className="w-full bg-slate-800 p-2 my-2 rounded-sm"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </label>
                <label>Display name
                    <input
                        type="text"
                        className="w-full bg-slate-800 p-2 my-2 rounded-sm"
                        value={displayname}
                        onChange={e => setDisplayName(e.target.value)}
                        placeholder={username}
                    />
                </label>
            </div>
            {response.message && <Notice message={response.message} severity={response.severity} />}
            <button className="place-self-center w-2/3 py-2 px-8 bg-blue-500 text-xl">Register</button>
            <NavLink to="/login" className="text-center text-lg text-gray-400">I have an account already</NavLink>
        </form>
    )
}