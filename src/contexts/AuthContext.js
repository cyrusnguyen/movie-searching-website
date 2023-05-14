import { createContext, useContext, useState, useEffect } from 'react';
import jwtDecode from "jwt-decode";
import { useLogout, useRefreshToken } from '../api/authAPI';

export const AuthContext = createContext({
    isAuthenticated: false,
    user: null,
    bearerToken: null,
    refreshToken: null
})

export function AuthContextProvider ( {children} ){
    const { logout } = useLogout();
    const { refresh, newBearertoken, message, isRefreshed } = useRefreshToken();
    const [ authState, setAuthState ] = useState({

        isAuthenticated: localStorage.getItem('isAuthenticated'),
        user: localStorage.getItem('user'),
        bearerToken: localStorage.getItem('bearerToken'),
        refreshToken: localStorage.getItem('refreshToken')

    });

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        const bearerToken = localStorage.getItem("bearerToken");
        const refreshToken = localStorage.getItem("refreshToken");
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
                        localStorage.removeItem("bearerToken");
                        localStorage.setItem("isAuthenticated", false);
                        setAuthState({
                            isAuthenticated: false,
                            user: null,
                            bearerToken: null,
                            refreshToken: null,
                        });
                        
                        alert("Your session has expired. Please log in again.");
                        logout();
                    }else{
                        // If refreshToken still valid, refresh bearerToken
                        refresh().then(() => {
                            if( isRefreshed ) {
                                console.log(message);
                                localStorage.setItem("bearerToken", newBearertoken);
                                localStorage.setItem("isAuthenticated", true);
                                setAuthState({
                                    isAuthenticated: true,
                                    user: user,
                                    bearerToken: newBearertoken,
                                    refreshToken: refreshToken,
                                });
                                
                            }
                            else{
                                localStorage.setItem("isAuthenticated", false);
                                alert("There was an error refreshing your session. Please log in again.");
                                logout();
                            }
                            
                        });
                    }
                
                }else{
                    localStorage.removeItem("bearerToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.setItem("isAuthenticated", false);
                    setAuthState({
                        isAuthenticated: false,
                        user: null,
                        bearerToken: null,
                        refreshToken: null,
                    });
                    
                    alert("There was an error with your session. Please login again");
                    logout();
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
        }
      };

    return (
    <AuthContext.Provider value={{ checkAuthStatus, authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
    );
}
