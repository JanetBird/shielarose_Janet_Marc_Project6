import React from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


//This component display each idea
const Ideas = ({
        handleClickIdea,
        ideaKey,
        ideaName,
        handleDeleteIdea,
    }) => {
    return(
            <div className="idea"> 
                <div className="ideaLink" onClick={() => handleClickIdea(ideaKey)}>
                    <h3>{ideaName}</h3>
                </div>
                <div className="ideaDelete">
                    <FontAwesomeIcon icon={faTimes} aria-hidden title="Delete Idea" onClick={() => handleDeleteIdea(ideaKey)}/>
                    <span className="visuallyhidden">Delete Idea</span>
                </div>
            </div> 
    )
}

export default Ideas;