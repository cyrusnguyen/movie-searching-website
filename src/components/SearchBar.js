import styled from "styled-components";
import { FiSearch } from "react-icons/fi"
import { AiOutlineArrowRight, AiOutlineClose } from "react-icons/ai"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from 'reactstrap';

export default function SearchBar(){
    const [ searchTerm, setSearchTerm ] = useState("")
    const navigate = useNavigate();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/movies/${searchTerm}`);
    }

    return (
        <SearchBarComponent>
            <Form onSubmit={handleSubmit}>
            <div className="searchBarContainer">
                <h2> Search for movie names</h2>
                
                

                <FiSearch className="searchIcon"></FiSearch>
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="searchInput" placeholder="Search..." />
                

                <AiOutlineArrowRight className="arrowIcon" onClick={handleSubmit}></AiOutlineArrowRight>
                {searchTerm && 
                <AiOutlineClose className="clearSearchBtn" onClick={() => setSearchTerm("") }></AiOutlineClose> }
                

            </div>
            </Form>
        </SearchBarComponent>
    );
}

const SearchBarComponent = styled.div`
    background-color: var(--color-black);
    color: var(--color-white);
    padding: 0 0;
    position: relative;
    
    .searchBarContainer {
        text-align: center;

    }
    .searchIcon {
        font-size: 1.5rem;
        transform: translateX(35px) translateY(-5px);
        color: var(--color-white);
    }
    .searchInput {
        
        padding: 20px 40px;
        border: 2px solid var(--color-white);
        box-shadow: 0px 0px 3px var(--color-white);
        border-radius: 20px;
        width: 60%;
        height: 3rem;
        color: var(--color-white);
        background: var(--color-black);
        opacity: 0.6;
        font-size: 1.3rem;

    

        &:hover {
            border: 2px solid;
            background: rgb(50, 50, 50);
            opacity: 1;
        }
        
    }

    .clearSearchBtn {
        color: var(--color-white);
        background-color: transparent;
        border: none;
        font-size: 1.5rem;
        transform: translateX(-95px) translateY(-3px);
        cursor: pointer; 
    }
    .arrowIcon {
        color: white;
        
        background: var(--color-blue);
        opacity: 0.6;
        margin-left: 0.5rem;
        margin-bottom: 0.5rem;

        bottom: 0;
        width: 3.2rem;
        height: 3.2rem;
        padding: 1rem 1rem;
        font-size: 1rem;
        border-radius: 2rem;

        z-index: 9;

        &:hover {
            background: var(--color-blue);
            opacity: 1;
            
            transition: .2s;
            
        }
    }
`;