import styled from "styled-components"
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useMovieSearch } from "../api/moviesAPI"
import React, { useState, useEffect, useCallback, useRef } from "react";
import SearchBar from "./SearchBar";
import { useSearchParams, useNavigate } from "react-router-dom";
import { IconName } from "react-icons/bi";
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';


export default function Movies() {
    
    // Search definitions
    const [ searchYear, setSearchYear ] = useState("")
    const [ searchQuery, setSearchQuery ] = useState("?title="+"&year="+searchYear);
    const [ searchTerm ] = useSearchParams();

    // Dropdown definitions
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => 1990 + i);
    const [ dropdownOpen, setDropdownOpen ] = useState(false);
    const [ selectedYear, setSelectedYear ] = useState("Select Year")
    
    // Search values
    const navigate = useNavigate();
    const { loading, movies, pagination, error } = useMovieSearch(searchQuery);


    // AG-GRID definitions
    const [rowData, setRowData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [gridApi, setGridApi] = useState(null);
    const [ localeText, setLocaleText ] = useState("")

    // Pagination definitions
    const totalItems = 100;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const columns = [
        { headerName: "Title", field: "title", filter: 'agTextColumnFilter', minWidth: 300, flex: 1},
        { headerName: "Year", field: "year", filter: 'agNumberColumnFilter'},
        { headerName: "imdbID", field: "imdbID", hide: "true" },
        { headerName: "Tomatoes Rating", field: "rottenTomatoesRating", filter: 'agNumberColumnFilter'},
        { headerName: "Metacritic Rating", field: "metacriticRating", filter: 'agNumberColumnFilter'},
        { headerName: "Classification", field: "classification", filter: 'agTextColumnFilter'},
    ]
    const defaultColDef = [
        {
            sortable: true,
            minWidth: 100,
            resizable: true,
            autoWidth: true,
        }
    ]
    const handleYearChange = (e) => {
        const yearValue = e.currentTarget.textContent;
        setSearchYear(yearValue);
        setSelectedYear(yearValue);
        setCurrentPage(1);
    }
    const handlePageChange = (e) => {
        setCurrentPage(e);
        const titleSearch = searchTerm.get("title")!==null?searchTerm.get("title"):"";
        setSearchQuery("?title="+titleSearch+"&year="+searchYear+"&page="+e)
    }

    
      const renderPaginationItems = () => {
        const items = [];
        const visiblePages = 4;
    
        const visibleMiddlePage = Math.floor(visiblePages / 2);
        const startPage = Math.max(1, currentPage - visibleMiddlePage);
        const endPage = Math.min(pagination.lastPage, startPage + visiblePages - 1);
    
        for (let i = startPage; i <= endPage; i++) {
          items.push(
          <PaginationItem key={i} active={i === currentPage}>
            <PaginationLink onClick={() => handlePageChange(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
          );
        }
    
        return items;
      };
    
    

    useEffect(() => {
        if(pagination){setLocaleText(`Showing ${pagination.from+1} to ${pagination.to} of ${pagination.total} results`)}
    },[pagination])

    useEffect(() => {
        const titleSearch = searchTerm.get("title")!==null?searchTerm.get("title"):"";
        setSearchQuery("?title="+titleSearch+"&year="+searchYear);
        setCurrentPage(1);
    },[searchTerm, searchYear])

    if (error) {
        console.log(error)
        return(
            <div>ERROR!</div>
        )
    }
    return loading ? (
        <React.Fragment>
            <LoadingComponent>
                <h1 className="loading">Loading...</h1>
            </LoadingComponent>
        </React.Fragment>
        ) : 
        (
        <React.Fragment>

            < MoviesComponent>
                
                <h1>MOVIES</h1>
                <div className="dataFilter">
                    <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
                        <DropdownToggle caret>
                            {selectedYear}
                        </DropdownToggle>
                        <DropdownMenu className="dropdownMenu">
                            {years.map((year) => (
                            <DropdownItem onClick={handleYearChange} key={year}>{year}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div className="ag-theme-alpine">
                    <AgGridReact 
                    columnDefs={columns}
                    animateRows={true}
                    rowData={movies}
                    defaultColDef={defaultColDef}
                    onRowClicked={(row) => navigate(`/movie/${row.data.imdbID}`)}
                    
                                
                    />
                    
                    
                </div>
                <div className="paginationBar">
                <Pagination aria-label="Page navigation example">
                    <PaginationItem disabled={currentPage <= 1}>
                        <PaginationLink first onClick={() => handlePageChange(1)} />
                    </PaginationItem>

                    {renderPaginationItems()}                 

                    <PaginationItem disabled={currentPage >= pagination.lastPage}>
                        <PaginationLink last onClick={() => handlePageChange(pagination.lastPage)} />
                    </PaginationItem>
                </Pagination>
                    <div className="showingRows">{localeText}</div>
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

    
    .dataFilter {
        display: flex;
        
        .dropdownMenu {
            height: 40vh;
            overflow-y: scroll;
            background: var(--color-white);
            flex-direction: row;
            align-items: end;
        }
    }
    .ag-theme-alpine {
        padding: 10px;
        padding-bottom: 0px;
        margin-bottom: 0px;
        width: 100%;
        height: 600px;
        --ag-foreground-color: var(--color-brighter-black);
        --ag-background-color: var(--color-white);
        --ag-header-foreground-color: var(--color-brighter-black);
        --ag-header-background-color: var(--color-blue);
        --ag-odd-row-background-color:  var(--color-brighter-blue);
      
        --ag-font-size: 17px;
      }
    
    .paginationBar {
        background: var(--color-white);
        color: var(--color-brighter-black);
        font-size: 1.2rem;
        margin: 0px 10px 10px 10px;
        padding-top: 0px;
        padding-right: 10px;
        
        .pagination{
            display: flex;
            justify-content: center;
        }
        .showingRows {
            display: flex;
            justify-content: flex-end
        }
    }
    
    
`;