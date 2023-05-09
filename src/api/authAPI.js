import { useState, useEffect } from 'react';
const API_URL = "http://sefdb02.qut.edu.au:3000/user"

export function useRegistration(email, password) {
    const [isCreated, setCreated] = useState(false);
    const [message, setMesaage] = useState('');
    const [statusCode, setStatusCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const registerURL = API_URL + "/register";

    const register = async () => { 
        try{
            return await fetch(registerURL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: email, password: password})
            }).then((data) => {
                setCreated(data.ok);
                setIsLoading(false);
                setMesaage(data.statusText);
                setStatusCode(data.statusCode)
            })
        }catch(e){
            setMesaage(e);
            setIsLoading(false);
            setErrorMessage(e);
            return e;
        }
        
    }

    return { register, errorMessage: errorMessage, statusCode: statusCode, isCreated: isCreated, message: message,  loading: isLoading };
}
export function useLogin(email, password) {

}