import { useState, useEffect } from 'react';

const API_URL = "http://sefdb02.qut.edu.au:3000"

export function usePersonSearch(id="") {
    
    const [loading, setLoading] = useState(true);
    const [personDetails, setPersonDetails] = useState(null);
    const [error, setError] = useState(null);
    useEffect(
        // the effect
        () => {
        getPersonDetail(id).then((personDetails) => (setPersonDetails(personDetails)))
        .catch((e) => {
                setError(e)
            }).finally(() => {
                setLoading(false);
            } );    
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
