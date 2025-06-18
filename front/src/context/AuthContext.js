// front/src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the AuthProvider component
export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // This effect runs when the component mounts to check for a token in localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
        }
    }, []);

    // Function to handle user login
    const login = (newToken) => {
        localStorage.setItem('token', newToken); // Store token in browser's local storage
        setToken(newToken);
        setIsAuthenticated(true);
    };

    // Function to handle user logout
    const logout = () => {
        localStorage.removeItem('token'); // Remove token from local storage
        setToken(null);
        setIsAuthenticated(false);
    };

    // The value that will be available to all consuming components
    const value = {
        token,
        isAuthenticated,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Create a custom hook for easy access to the context
export function useAuth() {
    return useContext(AuthContext);
}