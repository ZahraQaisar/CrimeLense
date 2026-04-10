import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);  // true until localStorage is read

    // Load auth state from localStorage on mount
    useEffect(() => {
        const storedAuth = localStorage.getItem('crimelense_auth');
        if (storedAuth) {
            try {
                const { isAuthenticated: auth, user: userData } = JSON.parse(storedAuth);
                setIsAuthenticated(auth);
                setUser(userData);
            } catch (error) {
                console.error('Error loading auth state:', error);
                localStorage.removeItem('crimelense_auth');
            }
        }
        setIsLoading(false); // done reading — safe to render protected routes
    }, []);

    // Save auth state to localStorage whenever it changes
    useEffect(() => {
        if (isAuthenticated && user) {
            localStorage.setItem('crimelense_auth', JSON.stringify({ isAuthenticated, user }));
        } else {
            localStorage.removeItem('crimelense_auth');
        }
    }, [isAuthenticated, user]);

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('crimelense_auth');
    };

    const updateUser = (updatedData) => {
        setUser(prev => ({ ...prev, ...updatedData }));
    };

    const value = {
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
