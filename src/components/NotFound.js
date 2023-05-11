import styled from "styled-components"
import SearchBar from "./SearchBar"
import React from "react"

export default function NotFound() {
    return(
        <React.Fragment>

            <NotFoundComponent>
            
            <h1 className="notFoundTitle"> 404! NOT FOUND </h1>

            <h3 className="notFoundMessage"> We can't find the page you're looking for </h3>

            </NotFoundComponent>
        </React.Fragment>
        
    )
}
const NotFoundComponent = styled.div`
    height: 50vh; 
    padding-top: 50px;
    text-align: center;
    justify-content: center;
    align-items: center;
    background: var(--color-brighter-black);

    .notFoundTitle {
        padding: 1rem;
        font-size: 70px;
        background: var(--color-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        
    }
    .notFoundMessage{
        padding: 1rem;
        font-size: 50px;
        background: var(--color-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    @media only screen and (max-width: 600px) {
        .notFoundTitle {
            font-size: 50px;
        }
        .notFoundMessage {
            font-size: 30px;
        }
    }
    @media only screen and (max-width: 200px) {
        .notFoundTitle {
            font-size: 30px;
        }
        .notFoundMessage {
            font-size: 15px;
        }
    }
`