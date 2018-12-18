import React from 'react';
import FilteredSearchResults from './FilteredSearchResults';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

//This component displays the search input field used to search for registries
const GuestSearchForm = ({
        handleSearchSubmit,
        searchInput,
        handleSearchChange,
        filteredReg,
        handleFilteredClick
    }) => {
      return (
            <div className="guestSearch outerWrapper">
                <form className="guestSearchForm" onSubmit={handleSearchSubmit}>
                  <label htmlFor="guestSearchBar" className="visuallyhidden">Search all registries:</label>
                    <input
                        type="text" id="guestSearchBar"
                        placeholder="Search all registries"
                        className="guestSearchBar"
                        value={searchInput}
                        onChange={handleSearchChange}
                        autoComplete="off"
                    />
                    <Link to="/searchresults" onClick={handleSearchSubmit}>
                        <button className="searchIcon">
                            <FontAwesomeIcon icon={faSearch} aria-hidden title="Search Registries" />
                            <span className="visuallyhidden">Search Registries</span>
                        </button>
                    </Link>
                    <FilteredSearchResults 
                        filteredReg={filteredReg}
                        handleFilteredClick={handleFilteredClick}
                    />
                </form>
            </div>
        )  
}

export default GuestSearchForm;