import React from 'react';
import { Link } from 'react-router-dom';

//This component displays the search suggestions
const FilteredSearchResults = ({
      filteredReg,
      handleFilteredClick,
   }) => {
      return (
         <div className="filteredResults">
            { filteredReg &&
               <ul>
                     { Object.values(filteredReg).map((entry) => {
                        // entry returns each array that matches the search query. [0] = key, [1] = object with info
                        return (
                           <Link to={`/guest/${entry[0]}`} key={entry[0]} onClick={() => {
                              // Get the registry ID of the user
                              handleFilteredClick(entry[0]);
                           }
                           }> {/* now links to key */} 
                              <li value={entry[1].name}>{entry[1].p1FirstName} & {entry[1].p2FirstName}</li>
                           </Link>
                        )
                     })}
               </ul>
            }
         </div>
      )
   
}

export default FilteredSearchResults; 