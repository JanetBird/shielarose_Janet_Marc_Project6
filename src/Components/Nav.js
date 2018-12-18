import React from 'react';
import { Link } from 'react-router-dom';
import SearchNav from './SearchNav';

const Nav = ({
    signOut,
    resetSearchParams,
    filteredReg,
    handleSearchChange,
    handleSearchSubmit,
    searchInput,
    handleFilteredClick
}) => {
    return (
        <nav className="clearfix">
            <div className="outerWrapper navFlex">
                <Link to="/registries" onClick={resetSearchParams}>
                    <h1 className="navH1 first"><span>go</span><span>fund</span><span>my</span><span>wedding</span></h1>
                    
                    <h1 className="navH1 second"><span>g</span><span>f</span><span>m</span><span>w</span></h1>
                </Link>
                <ul>
                    <li>
                        <SearchNav
                            filteredReg={filteredReg}
                            handleSearchChange={handleSearchChange}
                            handleSearchSubmit={handleSearchSubmit}
                            searchInput={searchInput}
                            handleFilteredClick={handleFilteredClick}

                        />
                        {/* <p>Welcome, {displayName} </p> */}
                    </li> 
                    <li>
                        <button className="signOut" onClick={signOut}>Sign Out</button>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Nav;

