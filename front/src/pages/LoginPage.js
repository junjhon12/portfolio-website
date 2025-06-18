// front/src/pages/LoginPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting
import { useAuth } from '../context/AuthContext'; // Import our custom hook

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook for navigation
    const { login } = useAuth(); // Get the login function from our context

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed. Please check your credentials.');
            }

            const data = await response.json();
            login(data.token); // Use the login function from context to store the token
            navigate('/'); // Redirect to the main admin page

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
                <form onSubmit={handleSubmit}>
                    {/* ... form inputs are the same ... */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                    </div>

                    {/* Display error message if it exists */}
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;