import React from 'react';
import GuestSearchForm from './GuestSearchForm';

//This component contains the search Nav
const SearchNav = ({
      filteredReg,
      handleSearchChange,
      handleSearchSubmit,
      searchInput,
      handleFilteredClick
   }) => {
      return (
         <div className="searchNav">
            { 
            <GuestSearchForm
               filteredReg={filteredReg}
               handleSearchChange={handleSearchChange}
               handleSearchSubmit={handleSearchSubmit}
               searchInput={searchInput}
               handleFilteredClick={handleFilteredClick}
            />  }       
         </div>
      )

}

export default SearchNav;