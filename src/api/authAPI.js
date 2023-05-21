import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { AuthContext, useAuth } from '../contexts/AuthContext';
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
    const { authState, setAuthState } = useAuth();
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
                    localStorage.setItem("user", email);
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
                setIsLoggedOut(true);
                setMessage("Logged out successfully")
            }
            localStorage.removeItem("bearerToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            localStorage.setItem("isAuthenticated", false);
            setAuthState({
                isAuthenticated: false,
                user: null,
                bearerToken: null,
                refreshToken: null
            });
            
        }else{
            console.log("User not logged in");
            setIsLoggedOut(false);
        }
        
        
    }
    return ( {logout, isLoggedOut: isLoggedOut, message: message})
}


export function useRefreshToken() {
    const { authState, setAuthState } = useAuth();;
    const refreshURL = API_URL + "/refresh"
    const [ newBearertoken, setNewBearerToken ] = useState("");
    const [ message, setMessage ] = useState("");
    const [ isRefreshed, setIsRefreshed ] = useState(false);
    const refreshToken = localStorage.getItem("refreshToken")
    const bearerToken = localStorage.getItem("bearerToken")
    const email = localStorage.getItem("user")

    const navigate = useNavigate();
    
    const refresh = async () => {
        return fetch(refreshURL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                refreshToken: refreshToken
            })
        }).then((response) => response.json()).then((responseData) => {
            if (responseData.error === true){

                setMessage(responseData.message);
                setIsRefreshed(false)
                console.log("Error from authAPI", responseData)
            } else{
                setMessage("Token successfully invalidated");
                localStorage.setItem("bearerToken", responseData.bearerToken.token);
                localStorage.setItem("refreshToken", responseData.refreshToken.token);
                setNewBearerToken(responseData.bearerToken.token);
                console.log("New bearer token from authAPI", responseData.bearerToken.token)
                setAuthState({
                    isAuthenticated: true,
                    user: email,
                    bearerToken: responseData.bearerToken.token,
                    refreshToken: responseData.refreshToken.token
                });
                
                setIsRefreshed(true);
                console.log("Token successfully updated, new token:", responseData.bearerToken.token) 

                }
        }); 
        
    }
    return ( { refresh, newBearertoken: newBearertoken, message: message, isRefreshed: isRefreshed } )
}
