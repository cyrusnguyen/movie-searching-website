import styled from "styled-components"
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { agNumberColumnFilter } from "ag-grid-react"
import { useMovieSearch } from "../api/moviesAPI"
import React, { useState } from "react";
import SearchBar from "./SearchBar";

export default function Movies() {
    const { loading, movies, error } = useMovieSearch();
    if (error) {
        console.log(error)
        return(
            <div>ERROR!</div>
        )
    }
    const columns = [
        { headerName: "", field: "image"},
        { headerName: "Title", field: "title", filter: 'agTextColumnFilter'},
        { headerName: "Year", field: "year", filter: 'agNumberColumnFilter'},
        { headerName: "imdbID", field: "imdbID"},
        { headerName: "Tomatoes Rating", field: "rottenTomatoesRating", filter: 'agNumberColumnFilter'},
        { headerName: "Metacritic Rating", field: "metacriticRating", filter: 'agNumberColumnFilter'},
        { headerName: "Classification", field: "classification", filter: 'agTextColumnFilter'},
    ]
    const defaultColDef = [
        {
            sortable: true
        }
    ]
    return loading ? (
        <React.Fragment>
            <SearchBar />
            <LoadingComponent>
                <h1 className="loading">Loading...</h1>
            </LoadingComponent>
        </React.Fragment>
        ) : 
        (
        <React.Fragment>
            <SearchBar />
            < MoviesComponent>
                
                <h1>MOVIES</h1>
                <div className=""></div>
                <div className="ag-theme-alpine">
                <AgGridReact 
                columnDefs={columns}
                rowData={movies}
                animateRows={true}
                defaultColDef={defaultColDef}
                paginationAutoPageSize={true}
                pagination={true}

                />
                </div>
                
                
            </MoviesComponent>
        </React.Fragment>
    )
}
const LoadingComponent = styled.div`

    background: var(--color-brighter-black);
    color: var(--color-white);

`;
const MoviesComponent = styled.div`
    color: var(--color-white);
    background: var(--color-brighter-black);
    .ag-theme-alpine {
        width: 100%;
        height: 400px;
        --ag-foreground-color: var(--color-brighter-black);
        --ag-background-color: var(--color-white);
        --ag-header-foreground-color: var(--color-brighter-black);
        --ag-header-background-color: var(--color-blue);
        --ag-odd-row-background-color:  var(--color-brighter-blue);
      
        --ag-font-size: 17px;
      }
    
`;