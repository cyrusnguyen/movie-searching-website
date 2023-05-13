import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { AuthContext } from '../provider/AuthProvider';
const API_URL = "http://sefdb02.qut.edu.au:3000/user"



export function useRegistration() {
    const [isCreated, setCreated] = useState(false);
    const [message, setMesaage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const registerURL = API_URL + "/register";
    const register = async (email, password) => { 
        try{
            const response = await fetch(registerURL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: email, password: password})
            });

            if (!response.ok){
                if (response.status === 400){
                    setMesaage("Request body incomplete, both email and password are required");
                }
                else if (response.status === 409){
                    setMesaage("User already exists.");
                }
                else if (response.status === 429){
                    setMesaage("Too many requests, please try again later.");
                }
                setIsLoading(false);
                setCreated(false);
                
            }
            else {
                setCreated(true);
                setIsLoading(false);
                setMesaage("User created successfully");
            }

        }catch (error) {
            throw new Error(error.message)
        }
            
        
    }

    return { register, message: message, isCreated: isCreated, message: message,  loading: isLoading };
}
export function useLogin() {
    const { token, setToken } = useContext(AuthContext);
    const loginURL = API_URL + "/login";
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [message, setMesaage] = useState('');
    const navigate = useNavigate();
    

    const login = async (email, password) => { 
        try{
            const response = await fetch(loginURL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: email, password: password})
            });
            if (!response.ok){
                if(response.status === 401) {
                    setMesaage("Incorrect email or password");
                }else if(response.status === 400){
                    setMesaage("Request body incomplete, both email and password are required");
                }else if(response.status === 429){
                    setMesaage("Too many requests, please try again later.");
                }
                setIsLoggedIn(false);

            } else{
                response.json().then((res) => {
                    setIsLoggedIn(true);
                    setMesaage("Logged in successfully");
                    localStorage.setItem("bearerToken", res.bearerToken.token);
                    localStorage.setItem("refreshToken", res.refreshToken.token);
                    navigate('/');
                  })
            }
        }catch (error) {
            throw new Error(error.message)
        }

    }

    
    return ( { login, isLoggedIn: isLoggedIn, message: message})

}

export function useLogout() {
    const logoutURL = API_URL + "/logout";
    const [ isLoggedOut, setIsLoggedOut ] = useState(null)
    const navigate = useNavigate();
    const logout = () => {
        
        const token = localStorage.getItem("refreshToken")
        if (token){
            fetch(logoutURL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    refreshToken: token
                })
            });
            localStorage.removeItem("bearerToken");
            localStorage.removeItem("refreshToken");
            setIsLoggedOut(true);
            navigate('/');
        }else{
            console.log("User not logged in")
        }
        
        
    }
    return ( {logout, isLoggedOut})
}

export function useAuth () {
    
    const { logout, isLoggedOut } = useLogout();
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        user: null,
        token: null,
    });

    useEffect(() => {
        const token = localStorage.getItem("bearerToken");
        console.log(token)
        
        if (token) {
            const user = jwtDecode(token).email;
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                console.log("Expired token");
                // Token has expired
                localStorage.removeItem("bearerToken");
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                    token: null,
                });
                
                alert("Your session has expired. Please log in again.");
                logout();
            } else {
            setAuthState({
                isAuthenticated: true,
                user: user,
                token: token,
            });
            }
        }
    }, []);

    return authState;
}

