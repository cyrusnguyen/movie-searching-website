import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const API_URL = "http://sefdb02.qut.edu.au:3000"

export function usePersonSearch(id="") {
    const { checkAuthStatus, authState } = useContext(AuthContext);
    
    const [loading, setLoading] = useState(true);
    const [personDetails, setPersonDetails] = useState(null);
    const [error, setError] = useState(null);
    useEffect(
        // the effect
        () => {
        checkAuthStatus();
            
        if(authState.isAuthenticated){
            getPersonDetail(id).then((personDetails) => {
                setPersonDetails(personDetails)
            })
            .catch((e) => {
                setError(e)
            }).finally(() => {
                setLoading(false);
            } );    
        }else{
            console.log(authState)
            setError("You are not authenticated or your session has expired!")
        }
        
        },
        [id],
        );
    return {
        loading,
        personDetails: personDetails,
        error: error,
    }
}

function getPersonDetail(id) {
    const url = API_URL + `/people/${id}`;
    const token = localStorage.getItem('bearerToken');

    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => data)
   
}
