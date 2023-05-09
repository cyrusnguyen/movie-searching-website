import { useState, useEffect } from 'react';
const API_KEY = "";
const API_URL = "http://sefdb02.qut.edu.au:3000"
const QUERY = "";
export function useMovieSearch() {
    const [loading, setLoading] = useState(true);
    const [movies, setMovieResults] = useState([]);
    const [error, setError] = useState(null);
    useEffect(
        // the effect
        () => {
        getMoviesByQuery().then((movies) => {
            setMovieResults(movies);
            }).catch((e) => {
                setError(e)
            }).finally(() => {
                setLoading(false);
            } );
        },
        [],
        );
    return {
        loading,
        movies: movies,
        error: error,
    }
}
function getMoviesByQuery() {
    const url = API_URL + `/movies/search`;
    return fetch(url)
    .then((res) => res.json())
    .then((res) => res.data)
    .then((movies) =>
    movies.map((movie) => ({
        title: movie.title,
        year: movie.year,
        imdbID: movie.imdbID,
        rottenTomatoesRating: movie.rottenTomatoesRating,
        metacriticRating: movie.metacriticRating,
        classification: movie.classification
    })));
}