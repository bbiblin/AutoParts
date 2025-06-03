// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');
    const [time_left, setTimeLeft] = useState('');

    // Verificar si hay un usuario logueado al cargar la app
    useEffect(() => {
        const storedToken = Cookies.get('authToken');
        const userData = Cookies.get('userData');

        if (storedToken && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setToken(storedToken);
                setUser(parsedUser);
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error parsing user data:', error);
                Cookies.remove('authToken');
                Cookies.remove('userData');
            }
        }

        setLoading(false);
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        setIsLoggedIn(true);
        
        const decoded_token = jwtDecode(token);

        if (decoded_token.exp) {
            console.log(new Date(decoded_token.exp * 1000)); // Fecha de expiración
            console.log((decoded_token.exp - decoded_token.iat) / 60, 'minutos'); // Duración del token
        }

        // aquí se guarda el token en la Cookie 'authToken' y expira en 1 día
        Cookies.set('authToken', token, { expires: 1, secure: true, sameSite: 'strict' });

        // Guardar id de usuario en Cookie 'user_id'
        Cookies.set('user_id', decoded_token.id);

        // Se guardan los datos de usuario en la Cookie 'userData'
        Cookies.set('userData', JSON.stringify(userData));

        // Guardar en localStorage
        //localStorage.setItem('authToken', token);
        //localStorage.setItem('userData', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);

        // Limpiar Cookies
        Cookies.remove('authToken');
        Cookies.remove('userData');
        //localStorage.removeItem('authToken');
        //localStorage.removeItem('userData');
    };

    const value = {
        user,
        isLoggedIn,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};