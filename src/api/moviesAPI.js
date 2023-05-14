import { useState, useEffect } from 'react';

const API_URL = "http://sefdb02.qut.edu.au:3000"

export function useMovieSearch(query) {
    const [loading, setLoading] = useState(true);
    const [movies, setMovieResults] = useState([]);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);
    useEffect(
        // the effect
        () => {
        getPaginationByQuery(query).then((pagination) => setPagination(pagination));
        getMoviesByQuery(query).then((movies) => {
            setMovieResults(movies);
            }).catch((e) => {
                setError(e)
            }).finally(() => {
                setLoading(false);
            } );    
        },
        [query],
        );
    return {
        loading,
        movies: movies,
        error: error,
        pagination: pagination
    }
}
export function useMovieDetail(id){
    const [ loading, setLoading ] = useState(true);
    const [ movieDetails, setMovieDetails ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ moviePrincipals, setMoviePrincipals ] = useState(null)

    const url = API_URL + `/movies/data/${id}`;
    useEffect(
        // the effect
        () => {
            fetch(url).then((response) => response.json())
            .then((responseData) => {
                setMovieDetails(responseData)
            })
            .catch((e) => {
                setError(e)
            }).finally(() => {
                setLoading(false);
            } );
        },
        [],
        );
    return {
        loading: loading,
        movieDetails: movieDetails,
        error: error
    }
}
function getMoviesByQuery(query) {
    const url = API_URL + `/movies/search${query}`;
    return fetch(url)
    .then((res) => res.json())
    .then((movies) => 
    movies.data.map((movie) => ({
        title: movie.title,
        year: movie.year,
        imdbID: movie.imdbID,
        rottenTomatoesRating: movie.rottenTomatoesRating,
        metacriticRating: movie.metacriticRating,
        classification: movie.classification
    })));
}
function getPaginationByQuery(query) {
    const url = API_URL + `/movies/search${query}`;
    return fetch(url)
    .then((res) => res.json())
    .then((movies) => movies.pagination);
}
function getMovieDetails(id){
    const url = API_URL + `/movies/data/${id}`;
    return fetch(url)
    .then((res) => 
    {
        return res.json();
    });
}