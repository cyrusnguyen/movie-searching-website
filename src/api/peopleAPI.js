import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useRefreshToken } from './authAPI';

export function usePersonSearch(id) {
    const { checkAuthStatus, authState } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [personDetails, setPersonDetails] = useState(null);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('bearerToken');

    useEffect(
        // the effect
        () => {
            checkAuthStatus().then(() => {
                if (authState.isAuthenticated === true || authState.isAuthenticated === "true") {
                   
                    getPersonDetail(id).then((personDetails) => {
                        setPersonDetails(personDetails)

                    })
                        .catch((e) => {
                            setError(e)
                        }).finally(() => {
                            setLoading(false);
                        });
                } else {
                    setError("You are not authenticated or your session has expired!")
                }
            });

        },
        [token],
    );
    return {
        loading,
        personDetails: personDetails,
        error: error,
    }
}

function getPersonDetail(id) {
    const url = process.env.REACT_APP_API_URL + `/people/${id}`;
    const token = localStorage.getItem('bearerToken');

    return fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())

}
