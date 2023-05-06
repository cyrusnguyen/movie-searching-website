import styled from "styled-components";
import { FiSearch } from "react-icons/fi"
import { AiOutlineArrowRight } from "react-icons/ai"

export default function SearchBar(){
    return (
        <SearchBarComponent>
        <div className="searchBarContainer">
            <h2> Search for movie names</h2>
            <FiSearch className="searchIcon"></FiSearch>
            <input type="text" className="searchInput" placeholder="Search...">
            
            </input>
            <AiOutlineArrowRight class="arrowIcon"></AiOutlineArrowRight>

        </div>
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
        border-radius: 20px;
        width: 60%;
        height: 3rem;
        color: var(--color-white);
        background: var(--color-black);
        opacity: 0.5;
        font-size: 1.3rem;
    

        &:hover {
            border: 2px solid;
            background: rgb(50, 50, 50);
            opacity: 1;
        }
        
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