import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { Navigate, useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

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

        // Guardar en cookies
        Cookies.set('authToken', token, { expires: 1, secure: true, sameSite: 'strict' });
        Cookies.set('user_id', decoded_token.id);
        Cookies.set('userData', JSON.stringify(userData));
        Cookies.set('isDistribuitor', userData.isDistribuitor);

        // Guardar estado de admin si existe
        if (userData.admin !== undefined) {
            Cookies.set('isAdmin', userData.admin);
        }

        if (navigate) {
            if (userData.admin === true) {
                navigate('/adminHome');
            } else if (userData.isDistribuitor === true) {
                navigate('/catalogo_mayorista');
            } else {
                navigate('/');
            }
        }
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        navigate('/');

        // Limpiar Cookies
        Cookies.remove('authToken');
        Cookies.remove('userData');
        Cookies.remove('isDistribuitor');
        Cookies.remove('isAdmin');
        Cookies.remove('user_id');
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