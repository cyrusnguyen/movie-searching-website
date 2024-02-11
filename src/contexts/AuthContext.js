import { createContext, useContext, useState, useEffect } from 'react';
import jwtDecode from "jwt-decode";
import { useRefreshToken } from '../api/authAPI';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({
    isAuthenticated: false,
    user: null,
    bearerToken: null,
    refreshToken: null
})

export function AuthContextProvider ( {children} ){
    const { refresh, newBearertoken, message, isRefreshed } = useRefreshToken();
    const navigate = useNavigate();
    const bearerToken = localStorage.getItem('bearerToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const [ authState, setAuthState ] = useState({

        isAuthenticated: localStorage.getItem('isAuthenticated'),
        user: localStorage.getItem('user'),
        bearerToken: bearerToken,
        refreshToken: refreshToken

    });

    const checkAuthStatus = async () => {
        if(bearerToken){
            const user = jwtDecode(bearerToken).email;
            const decodedBearer = jwtDecode(bearerToken);
            const currentTime = Date.now() / 1000;
            // If bearerToken expired, refresh
            if (decodedBearer.exp < currentTime) {
                
                if (refreshToken) {
                    const decodedRefresh = jwtDecode(refreshToken);
                    // If refreshToken expired, logout

                    if (decodedRefresh.exp < currentTime) {
                        localStorage.setItem("isAuthenticated", false);
                        setAuthState({
                            isAuthenticated: false,
                            user: null,
                            bearerToken: null,
                            refreshToken: null,
                        });
                        
                        alert("Your session has expired. Please log in again.");
                        navigate("/login")
                    }else{

                        // If refreshToken still valid, refresh bearerToken
                        await refresh();
                    }
                
                }else{
                    localStorage.setItem("isAuthenticated", false);
                    setAuthState({
                        isAuthenticated: false,
                        user: null,
                        bearerToken: null,
                        refreshToken: null,
                    });
                    
                    console("You are not logged in. Please login again");
                    navigate("/login")
                }
            // If bearerToken still valid, set AuthState to true
            }else{
                localStorage.setItem("isAuthenticated", true);
                setAuthState({
                    isAuthenticated: true,
                    user: user,
                    bearerToken: bearerToken,
                    refreshToken: refreshToken,
                });
            }
        }else{
            localStorage.setItem("isAuthenticated", false);
            setAuthState({
                isAuthenticated: false,
                user: null,
                bearerToken: null,
                refreshToken: null,
            });
            
            alert("Your session has expired or you're not logged in.");
            navigate("/login")
        }
      };

    return (
    <AuthContext.Provider value={{ checkAuthStatus, authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const { authState, setAuthState } = useContext(AuthContext);
    return { authState, setAuthState };
  };
