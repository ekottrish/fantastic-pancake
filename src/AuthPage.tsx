
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from './AppContext';

const AuthPage = () => {
    const { login, error } = useAppContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(username, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-deep to-background-dark p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-primary-deep/50 rounded-xl shadow-2xl backdrop-blur-lg relative">
                 <Link to="/" className="absolute top-4 left-4 text-accent hover:text-purple-400 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8a5 5 0 000-10H6" />
                    </svg>
                    <span className="sr-only">Go Home</span>
                 </Link>
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-accent">
                        Kachra Experience Zone
                    </h1>
                    <p className="text-light-gray">Your key to FPL & high stakes betting</p>
                    <p className="text-sm text-dark-gray mt-2">Only for members of BBA 31</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-dark-gray bg-background-dark placeholder-gray-500 text-light-gray focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-b-md relative block w-full px-3 py-3 border border-dark-gray bg-background-dark placeholder-gray-500 text-light-gray focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors">
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;