import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

//This component displays the sign in form popup
const SignInPopUp = ({ 
   handleSignInEmail,
   toggleSignInPopUp,
   googleSignIn,
   handleInputChange,
   signInPopUp
   }) => {
   
   return (
      <div>
         <div className={`${signInPopUp ? "popUpVisible" : "popUpNotVisible"} popUpBg`} onClick={toggleSignInPopUp}></div>
         <div className="signInForm signInUp">
            <form className="signInEmail" >
               <p className="signInUpText">Sign In</p>
               <p>Test and explore the app by using the guest sign in <span className="guestAccount">First name: guest, Email: guest@gmail.com, Password: 12345678</span></p>
               <FontAwesomeIcon icon={faTimes} onClick={toggleSignInPopUp} className="closeIcon" aria-hidden title="Close sign in pop up"></FontAwesomeIcon>
               <span className="visuallyhidden">Close sign in pop up</span>
      
               <label htmlFor="email" className="visuallyhidden">Email:</label>
               <input type="email" id="email" placeholder="email address" onChange={handleInputChange}/>
      
               <label htmlFor="password" className="visuallyhidden">Password:</label>
               <input type="password" id="password" placeholder="password" onChange={handleInputChange}/>
      
               <input type="submit" value="Sign In" onClick={handleSignInEmail}/>
            </form>
      
            <div className="or">
               <span>or</span>
            </div>
      
            <form className="signInGoogle">
               <input type="submit" value="Sign in with Google" onClick={googleSignIn} />
            </form>
         </div>
      </div>
   );
}

export default SignInPopUp;

