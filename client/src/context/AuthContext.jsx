import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${storedToken}`
                        }
                    };
                    const { data } = await axios.get('http://localhost:5000/api/auth/me', config);
                    setUser(data);
                } catch (error) {
                    console.error("Auth check failed:", error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            setUser(data.user);
            return data;
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            throw error;
        }
    };

    const signup = async (username, email, password) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/signup', { username, email, password });
            localStorage.setItem('token', data.token);
            setUser(data.user);
            return data;
        } catch (error) {
            console.error("Signup failed:", error.response?.data || error.message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
