import React from 'react';

//This function displays the home page of the web application
const Home = ({
   toggleSignUpPopUp,
   toggleSignInPopUp
   }) => {
      return (
         <div className="homeBgImg outerWrapper">
            <div className="homePage">
               <h1 className="homeTitle"><span>go</span><span>fund</span><span>my</span><span>wedding</span></h1>
               <p className="homeDescription">An online wedding registry for the couple's guests to pay towards the couple's honeymoon, dream home, and other large items</p>
               <p className="guestAccountTxt">Test and explore the app by using the guest sign in</p>
               <p className="guestAccount">First name: guest, Email: guest@gmail.com, Password: 12345678</p>
               <button className="homeButton homeSignIn" onClick={toggleSignInPopUp}>Sign In</button>
               <button className="homeButton homeSignUp" onClick={toggleSignUpPopUp}>Sign Up</button>
            </div>
         </div>
      )
   }

export default Home;
