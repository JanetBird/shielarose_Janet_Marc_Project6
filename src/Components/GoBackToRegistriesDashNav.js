import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const GoBackToRegistriesDashNav = () => {
   return (
      <div className="goBackNav outerWrapper">
         <Link to="/registries" className="goBackNavLink">  
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden title="go back to registries dashboard" className="goBackNavArrow"/>
            Go back to registry dashboard
         </Link>
      </div>
   )
}

export default GoBackToRegistriesDashNav;