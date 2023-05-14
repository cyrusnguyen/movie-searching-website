import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { AuthContext } from '../contexts/AuthContext';
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
                }else{
                    setMesaage("There was an error");
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
    const { authState, setAuthState } = useContext(AuthContext);
    const loginURL = API_URL + "/login";
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [message, setMessage] = useState('');
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
                    setMessage("Incorrect email or password");
                }else if(response.status === 400){
                    setMessage("Request body incomplete, both email and password are required");
                }else if(response.status === 429){
                    setMessage("Too many requests, please try again later.");
                }
                setIsLoggedIn(false);
                localStorage.setItem("isAuthenticated", false);

            } else{
                response.json().then((res) => {
                    setIsLoggedIn(true);
                    setMessage("Logged in successfully");
                    setAuthState({
                        isAuthenticated: true,
                        user: email,
                        bearerToken: res.bearerToken.token,
                        refreshToken: res.refreshToken.token
                    })
                    localStorage.setItem("isAuthenticated", true);
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
    const { authState, setAuthState } = useContext(AuthContext);
    const logoutURL = API_URL + "/logout";
    const [ isLoggedOut, setIsLoggedOut ] = useState(null)
    const [ message, setMessage ] = useState("");
    const navigate = useNavigate();
    const logout = async () => {
        
        const token = localStorage.getItem("refreshToken")
        if (token){
            const response = await fetch(logoutURL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    refreshToken: token
                })
            });
            if(!response.ok){
                if(response.status === 401) {
                    setMessage("JWT token has expired");
                }else if(response.status === 400){
                    setMessage("Request body incomplete, refresh token required");
                }else if(response.status === 429){
                    setMessage("Too many requests, please try again later.");
                }else{
                    setMessage("There was an error");
                }
                setIsLoggedOut(false);
            }else{
                localStorage.removeItem("bearerToken");
                localStorage.removeItem("refreshToken");
                localStorage.setItem("isAuthenticated", false);
                setIsLoggedOut(true);
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                    bearerToken: null,
                    refreshToken: null
                });
                setMessage("Logged out successfully")
                navigate('/');
            }
            
        }else{
            console.log("User not logged in");
            setIsLoggedOut(false);
        }
        
        
    }
    return ( {logout, isLoggedOut: isLoggedOut, message: message})
}


export function useRefreshToken() {
    const { authState, setAuthState } = useContext(AuthContext);
    const refreshURL = API_URL + "/refresh"
    const [ newBearertoken, setNewBearerToken ] = useState("");
    const [ message, setMessage ] = useState("");
    const [ isRefreshed, setIsRefreshed ] = useState(false);
    const refreshToken = localStorage.getItem("refreshToken")
    const bearerToken = localStorage.getItem("bearerToken")
    const navigate = useNavigate();
    
    const refresh = async () => {
        try{
        const response = await fetch(refreshURL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                refreshToken: refreshToken
            })
        }); 
        if (!response.ok){
            if(response.status === 401) {
                setMessage("JWT token has expired");
            }else if(response.status === 400){
                setMessage("Request body incomplete, refresh token required");
            }else if(response.status === 429){
                setMessage("Too many requests, please try again later.");
            }else{
                setMessage("There was an error");
            }
            setIsRefreshed(false)

        } else{
            response.json().then((res) => {
                setMessage("Token successfully invalidated");
                setNewBearerToken(res.bearerToken.token);
                const email = authState.user;
                setAuthState({
                    isAuthenticated: true,
                    user: email,
                    bearerToken: res.bearerToken.token,
                    refreshToken: res.refreshToken.token
                });
                localStorage.setItem("bearerToken", res.bearerToken.token);
                setIsRefreshed(true);
                navigate('/');
              })
        }
    }catch (error) {
        throw new Error(error.message)
    }}
    return ( { refresh, newBearertoken: newBearertoken, message: message, isRefreshed: isRefreshed } )
}
