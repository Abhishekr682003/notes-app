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
        const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data;
    };

    const signup = async (username, email, password) => {
        const { data } = await axios.post('http://localhost:5000/api/auth/signup', { username, email, password });
        localStorage.setItem('token', data.token);
        // The signup response implies the user is logged in, but data structure might differ slightly? 
        // My controller returns { _id, username, email, token } which is compatible.
        // Wait, controller returns explicit object.
        setUser({ id: data._id, username: data.username, email: data.email });
        return data;
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
