import { useNavigate, useParams } from "react-router-dom"
import React, { useContext } from "react"
import { useMovieDetail } from "../api/moviesAPI";
import styled from "styled-components";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AuthContext } from '../contexts/AuthContext';

export default function MovieDetail (){
    const { id } = useParams();
    const navigate = useNavigate();
    const { authState } = useContext(AuthContext);


    
    const { loading, movieDetails, error } = useMovieDetail(id);
    const columns = [
        { headerName: "ID", field: "id", hide: "true" },
        { headerName: "Role", field: "category", filter: 'agTextColumnFilter', minWidth: 200},
        { headerName: "Name", field: "name", filter: 'agTextColumnFilter', minWidth: 300},
        { headerName: "Characters", field: "characters", filter: 'agTextColumnFilter', minWidth: 400, flex: 1},
    ]
    const defaultColDef = [
        {
            sortable: true,
            minWidth: 50,
            resizable: true,
            autoWidth: true,
        }
    ]
    return (
        <React.Fragment>
            <MovieDetailComponent>
                { movieDetails && <React.Fragment>
                
                <div className="movieContainer">
                    <img src={movieDetails.poster} className="movieImage"></img>
                    <div className="movieInfoContainer">
                        <h1>{movieDetails.title}</h1>
                        <div className="movieInfo"> 
                            <div className="movieInfoLeft">
                                <p><b>Released in:</b> {movieDetails.year}</p>
                                <p><b>Runtime:</b> {movieDetails.runtime} minutes</p>
                                <p><b>Genres:</b> {movieDetails.genres.join(", ")}</p>
                                <p><b>Country:</b> {movieDetails.country}</p>
                                <p><b>Box Office:</b> ${movieDetails.boxoffice.toLocaleString()}</p>
                                <i>{movieDetails.plot}</i>
                            </div>
                            <div className="movieInfoRight">
                                <div className="ratingSection">
                                    {movieDetails.ratings.map((rating, index) => {
                                        return <div key={index}>
                                            <p><b>{rating.source}</b>: {rating.value}</p>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                        
                        
                    </div>
                    
                    

                
                
                    
                        
                    </div>
                    <div className="bottomContainer">
                        <div className="ag-theme-alpine"><AgGridReact 
                            columnDefs={columns}
                            rowData={movieDetails.principals.map((movieInfo) => ({
                                id: movieInfo.id,
                                category: movieInfo.category.charAt(0).toUpperCase() + movieInfo.category.slice(1),
                                name: movieInfo.name,
                                characters: movieInfo.characters.join(", ")
                            }))}
                            animateRows={true}
                            defaultColDef={defaultColDef}
                            paginationAutoPageSize={true}
                            pagination={true}
                            onRowClicked={(row) => navigate(`/person/${row.data.id}`)}

                            />
                        </div>
                        
                </div>
                </React.Fragment>

                }
            </MovieDetailComponent>
            

        </React.Fragment>
    )
}

const MovieDetailComponent = styled.div`
    color: var(--color-white);
    h1{
        text-align: center;
    }
    .movieContainer {
        font-size: 1.2rem;
        display: flex;
        padding: 10px;

        .movieImage {
            width: 50%;
            height: auto;
        }

        .movieInfo {
            overflow: auto;
            padding: 10px 20px;
            position: flex;
            display: flex;
            
            

            .movieInfoLeft {

                width: 70%;
            }

            .movieInfoRight {

                .ratingSection {
                    padding-left 10px;
                    align-self: flex-end;
        
                }
            }
        }

        &::after {

            content: "";
            clear: both;
            display: table;

        }

        @media only screen and (max-width: 800px) {
            .movieInfo {
                display: block;
            }
            .movieInfoLeft {
                float: none;
            }
            .movieInfoRight {
                float: none;
                .ratingSection {
                    padding-top: 10px;
        
                }
            }
        }
        
    }
    .bottomContainer{
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 10px;
        
        .ag-theme-alpine {
            width: 80vw;
            height: 400px;
            --ag-foreground-color: var(--color-brighter-black);
            --ag-background-color: var(--color-white);
            --ag-header-foreground-color: var(--color-brighter-black);
            --ag-header-background-color: var(--color-blue);
            --ag-odd-row-background-color:  var(--color-brighter-blue);
          
            --ag-font-size: 17px;
        }

    }
    

`;
