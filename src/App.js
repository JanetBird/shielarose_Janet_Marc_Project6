import React, { Component } from 'react';
import './styles/App.css';
import firebase from './firebase';
import Nav from './Components/Nav';
import SignInPopUp from './Components/SignInPopUp';
import SignUpForm from './Components/SignUpForm';
import RegistryDashboard from './Components/RegistryDashboard';
import Registry from './Components/Registry';
import GoBackToRegistriesDashNav from './Components/GoBackToRegistriesDashNav'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import GuestPage from './Components/GuestPage';
import SearchList from './Components/SearchList';
import Home from './Components/Home';
import Footer from './Components/Footer';


// Google provider & auth module
const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      signUpPopUp: false,
      signInPopUp: false,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      displayName: '',
      registries: [],
      foundReg: [],
      filteredReg: [],
      searchReg: [],
      searchInput:'',
      finalInput:'',
      noRegistries: false
    }
  }
  componentDidMount(){
    //Keeps user logged in even if they exit the page.
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ 
          user: user
        }, () => {  
          //Create Firebase DB Ref to the user ID and set state
          this.setState({
            dbRef: firebase.database().ref(`/${this.state.user.uid}`) 
          }, () => {
            //Pull the display name from Userinfo in firebase (create Userinfo if it doesnt exist) and set state
            this.state.dbRef.child('UserInfo/name').on('value', (snapshot) => {
              this.setState({
                displayName: snapshot.val()
              })
            })
            //Pulls the list of registries from firebase and set state
            this.state.dbRef.child('Registries').on('value', (snapshot) => {
              this.setState({
                registries: snapshot.val() || {}
              }, () => {
                if(Object.entries(this.state.registries).length === 0) {
                  this.setState({
                    noRegistries: true
                  })
                }
              })
            })
          })
        })
      }
    })

   
  }

  componentDidUpdate() {
    if (this.state.foundReg.length === 0) {
      //Get all registries from database and store to foundReg in state.
      this.regRef = firebase.database().ref('/All Registries');
      this.regRef.on('value', (snapshot) => {
        this.setState({
          // changed this to object.entries so we still have access to keys --> returns an array of arrays with all the keys and objects
          foundReg: Object.entries(snapshot.val())
        });
      });
    }
  }
  //Function to toggle boolean for signin popup
  toggleSignInPopUp = () => {
    this.setState({
      signInPopUp: !this.state.signInPopUp
    })
  }

  toggleSignUpPopUp = () => {
    this.setState({
      signUpPopUp: !this.state.signUpPopUp
    })
  }

  handleSubmitEmail = e => {
    e.preventDefault();
    //Create signup on firebase
    //Push Email signup user to firebase and sets user in state
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then((result) => {
      this.setState({
        user: result.user
      }, () => {
        const userObj = {
          name: `${this.state.firstName} ${this.state.lastName}`,
          email: this.state.email
        }
        //Clears the inputs and add dbRef to state, and assigns the firebase reference to the user id 
        this.setState({
          signInPopUp: false,
          signUpPopUp: false,
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          dbRef: firebase.database().ref(`/${this.state.user.uid}`)
        }, () => {
          //Create UserInfo node in firebvase and sets the value to userObj(name & email)
          this.state.dbRef.child('UserInfo').set(userObj);
        })
      })
    })
    .catch(function(error) {
      // Handle Errors here and displays error message -> TO FIX
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/email-already-in-use') {
        alert(errorMessage);
      }
    })
  }

  handleSignInEmail = (e) => {
    e.preventDefault();
    //handles sign in of email users
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => {
      //Toggles the signInPopup in state and the sign in popup appears
      this.toggleSignInPopUp();
    })
    .catch(function(error) {
      // Handle Errors here. -> TO FIX
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-email') {
        alert("Please enter a valid email");
      } else if (errorCode === 'auth/user-not-found'){
        alert("Sorry, there is no user with this email")
      }
    });
  }

  handleInputChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  // Handle Google login -> See above
  googleSignIn = e => {
    e.preventDefault();
    auth.signInWithPopup(provider)
    .then(result => {
      this.setState({
        user: result.user,
        signInPopUp: false
      }, () => {
        
        const userObj = {
          name: this.state.user.displayName,
          email: this.state.user.email
        }
        this.setState({
          dbRef: firebase.database().ref(`/${this.state.user.uid}`)
        }, () => {
          this.state.dbRef.child('UserInfo').set(userObj);
        })
      })
    })
  }

  signOut = () => {
    auth.signOut()
    .then(() => {
      this.setState({
        user: null
      })
    })
    
  }

  //Event handler for typing in search bar
  handleSearchChange = e => { 
    const value = e.target.value;
    const registriesArray = this.state.foundReg; 
    const re = new RegExp(`^${value}`, 'ig');
    const filteredRegistries = !value ? [] : registriesArray.filter((reg) => re.test(reg[1].name) || re.test(reg[1].p1FirstName) || re.test(reg[1].p2FirstName));
    // changed it to reg[1].name to filter into the object inside each array 
    this.setState({
      filteredReg: filteredRegistries,
      searchReg: filteredRegistries,
      searchInput: value,
      finalInput: value
    });
  }

  handleUpdateFilterResults = () => {
    this.setState({
      filteredReg: [],
    });

  }

  //On search submit, clear the suggestions, save the search Input to final input, and then clear the search field (searchInput)
  handleSearchSubmit = () => {
      this.setState({
        filteredReg: [],
        finalInput: this.state.searchInput
      }, () => {
        this.setState({
          searchInput: ''
        })
      });

  }

  resetSearchParams = () => {
    this.setState({
      foundReg: [],
      filteredReg: [],
      searchInput:'',
      finalInput:''
    })
  }

  render() {
     
    return (
      <Router>
        <div className="App">
          {/* If signInPopup is true then Popup appears */}
          {this.state.signInPopUp 
          ?
          <SignInPopUp
            handleSignInEmail={this.handleSignInEmail}
            toggleSignInPopUp={this.toggleSignInPopUp}
            googleSignIn={this.googleSignIn}
            handleInputChange={this.handleInputChange}
            signInPopUp={this.state.signInPopUp}
          />
          :
          null
          } 

          {/* If there is a user in state, show Nav bar */}
          {this.state.user 
          ? 
          <div>
            <Nav
              signOut={this.signOut}
              resetSearchParams={this.resetSearchParams}
              filteredReg={this.state.filteredReg}
              handleSearchChange={this.handleSearchChange}
              handleSearchSubmit={this.handleSearchSubmit}
              searchInput={this.state.searchInput}
            />
          </div>
          :
          null
          }

          {/* If there is a user in state, redirect to registries, else go to home page */}
          {this.state.user
          ?
          <div>
            <Redirect to="/registries" />
            <Route exact path="/registries" render={() => (
                <RegistryDashboard
                dbRef={this.state.dbRef}
                registries={this.state.registries}
                noRegistries={this.state.noRegistries}
                displayName={this.state.displayName}
                />
            )} />
            <Route exact path="/searchresults" render={() => (
                <div className="searchPage">
                  <GoBackToRegistriesDashNav resetSearchParams={this.resetSearchParams} />
                  <SearchList 
                    searchReg={this.state.searchReg}
                    foundReg={this.state.foundReg}
                    finalInput={this.state.finalInput}
                  />
                </div>
                )   
            }/>
            <Route exact path="/guest/:registry_id" component={GuestPage}/>
            
            <Route exact path="/registries/:registry_id" render={() => (
              <div>
                <GoBackToRegistriesDashNav resetSearchParams={this.resetSearchParams}/>
                <Registry 
                  registries={this.state.registries}
                  dbRef={this.state.dbRef}
                  handleUpdateFilterResults={this.handleUpdateFilterResults}
                /> 
              </div>
            )}/>
            
            <Footer />
          </div>
          :
          <div>
            <Redirect to="/" />
            <Home
              toggleSignUpPopUp={this.toggleSignUpPopUp}
              toggleSignInPopUp={this.toggleSignInPopUp}
            />
            {this.state.signUpPopUp
            ?
            <Route exact path="/" render={() => (
              <SignUpForm
                handleSubmitEmail={this.handleSubmitEmail}
                toggleSignInPopUp={this.toggleSignInPopUp}
                googleSignIn={this.googleSignIn}
                handleInputChange={this.handleInputChange}
                firstName={this.state.firstName}
                lastName={this.state.lastName}
                email={this.state.email}
                password={this.state.password}
                signUpPopUp={this.state.signUpPopUp}
                toggleSignUpPopUp={this.toggleSignUpPopUp}
              />
            )} 
            />
            :
            null
            }
          </div>
          }
        </div>
      </Router>
    );
  }
}

export default App;
