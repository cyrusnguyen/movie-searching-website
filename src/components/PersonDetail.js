import { useParams, useNavigate, Link } from "react-router-dom"
import styled from "styled-components";
import { usePersonSearch } from "../api/peopleAPI";
import React, { useEffect, useState } from "react"
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto"



export default function PersonDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { personDetails, loading, error } = usePersonSearch(id);

    const labelItems = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10']
    const [ chartData, setChartData ] = useState({
        labels: labelItems,
        datasets: [
          {
            label: 'Counts of ratings',
            data: null,
            backgroundColor: "black",
            borderColor: "black",
            borderWidth: 1,
          },
        ],
    })

    const columns = [
        { headerName: "ID", field: "id", hide: "true" },
        { headerName: "Role", field: "role"},
        { headerName: "Movie", field: "movieName", filter: 'agTextColumnFilter', minWidth: 200},
        { headerName: "Characters", field: "characters", filter: 'agTextColumnFilter', minWidth: 300},
        { headerName: "Rating", field: "rating", filter: 'agTextColumnFilter', minWidth: 400, flex: 1},
    ]
    const defaultColDef = [
        {
            sortable: true,
            minWidth: 50,
            resizable: true,
            autoWidth: true,
        }
    ]

    useEffect(() => {
        var newRatingCounts = new Array(10).fill(0);

        if(personDetails){
            personDetails.roles.map((personRoles) => {
                newRatingCounts[Math.floor(personRoles.imdbRating)] += 1;
            })
        };
        
        setChartData({
            labels: labelItems,
            datasets: [
              {
                label: 'Counts of ratings',
                data: newRatingCounts,
                backgroundColor: generateRGBAColor(0.5, labelItems.length),
                borderColor: generateRGBAColor(1, labelItems.length),
                borderWidth: 1,
              },
            ],
        })
    },[personDetails])
    
    return (
        error ? (
            <React.Fragment>
                <ErrorComponent>
                    <h1>{error}</h1>
                    <h2>Please <Link to="/login">click here</Link> to log in</h2>
                </ErrorComponent>
            </React.Fragment>
        ) : 
        (
        <PersonDetailComponent>
            { personDetails &&
            <React.Fragment>
            <h1>{personDetails.name}</h1>
            <h2>{personDetails.birthYear} - {personDetails.deathYear}</h2>
            <div className="gridContainer">
                <div className="ag-theme-alpine">
                    <AgGridReact 
                        columnDefs={columns}
                        rowData={personDetails.roles.map((personRoles) => ({
                            id: personRoles.movieId,
                            movieName: personRoles.movieName,
                            role: personRoles.category.charAt(0).toUpperCase() + personRoles.category.slice(1),
                            rating: personRoles.imdbRating,
                            characters: personRoles.characters.join(", ")
                        }))}
                        animateRows={true}
                        defaultColDef={defaultColDef}
                        paginationAutoPageSize={true}
                        pagination={true}
                        onRowClicked={(row) => navigate(`/movie/${row.data.id}`)}

                        />
                </div>
            </div>
            <div className="imdbChart">
                <h3>IMDB ratings at a glance</h3>
                <div className="chartContainer" style={{width:800}}>
                    {chartData && <Bar data={chartData}/>}
                </div>
            </div>
            </React.Fragment>
            }
        </PersonDetailComponent>
        )
            
        
        
        
        
    )
}


const PersonDetailComponent = styled.div`
    color: var(--color-white);
    .gridContainer {
        display: flex;
        justify-content: center;
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
const ErrorComponent = styled.div`
    color: var(--color-white);
    text-align: center;
    a {
        text-decoration: none;
    }
`
function generateRGBAColor(alphaValue, numberOfColors) {
    const listColors = [];
    
  
    for (let i = 0; i < numberOfColors; i++) {
      var redValue = Math.floor(Math.random() * 256);
      var greenValue = Math.floor(Math.random() * 256);
      var blueValue = Math.floor(Math.random() * 256);
      listColors.push(`rgba(${redValue}, ${greenValue}, ${blueValue}, ${alphaValue})`);
    }
    
    return listColors;
  }
  
