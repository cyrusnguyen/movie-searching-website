import styled from "styled-components"
import SearchBar from "./SearchBar";
import React from "react"

export default function Intro() {
    return (
        <React.Fragment>
            <IntroComponent> 
            
            <h1 className="introTitle">Minh Nguyen's<br
            />
            Movie Searching Website</h1>    
            </IntroComponent>
        </React.Fragment>
        
    )
}


const IntroComponent = styled.div`
    height: 50vh; 
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    background: var(--color-brighter-black);
    .introTitle 
    {
        padding: 1rem;
        font-size: 70px;
        background: var(--color-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        
    }
    
    @media only screen and (max-width: 600px) {
        .introTitle {
            font-size: 50px;
        }
    }
    @media only screen and (max-width: 200px) {
        .introTitle {
            font-size: 30px;
        }
    }
    
    
    
`;