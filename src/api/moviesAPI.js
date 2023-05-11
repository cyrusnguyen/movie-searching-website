import { useState, useEffect } from 'react';

const API_URL = "http://sefdb02.qut.edu.au:3000"

export function useMovieSearch(title="") {
    const [loading, setLoading] = useState(true);
    const [movies, setMovieResults] = useState([]);
    const [error, setError] = useState(null);
    useEffect(
        // the effect
        () => {
        getMoviesByQuery(title).then((movies) => {
            setMovieResults(movies);
            }).catch((e) => {
                setError(e)
            }).finally(() => {
                setLoading(false);
            } );
        console.log(title)
        },
        [title],
        );
    return {
        loading,
        movies: movies,
        error: error,
    }
}
function getMoviesByQuery(title) {
    const url = API_URL + `/movies/search?title=${title}`;
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