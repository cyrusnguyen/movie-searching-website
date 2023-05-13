import { createContext, useContext, useState, useEffect } from 'react';
import jwtDecode from "jwt-decode";
import { useLogout } from '../api/authAPI';

export const AuthContext = createContext({
    isAuthenticated: false,
    user: null,
    bearerToken: null,
    refreshToken: null
})

export function AuthContextProvider ( {children} ){
    const { logout } = useLogout();

    const [ authState, setAuthState ] = useState({
        isAuthenticated: false,
        user: null,
        bearerToken: null,
        refreshToken: null
    });

    useEffect(() => {
        const bearerToken = localStorage.getItem("bearerToken");
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (bearerToken) {
            const user = jwtDecode(bearerToken).email;
            const decoded = jwtDecode(bearerToken);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                localStorage.removeItem("bearerToken");
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                    bearerToken: null,
                    refreshToken: null,
                });
                
                alert("Your session has expired. Please log in again.");
                logout();
            } else {
            setAuthState({
                isAuthenticated: true,
                user: user,
                bearerToken: bearerToken,
                refreshToken: refreshToken,
            });
            }
        }
    }, []);

    return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
    );
}
