import React, { Component } from 'react';
import firebase from '../firebase';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import GoBackToRegistriesDashNav from './GoBackToRegistriesDashNav';

const regRef = firebase.database().ref('/All Registries')
const userRef = firebase.database().ref()

//This component display the page for guest to contribute to gift ideas
class GuestPage extends Component {
    constructor() {
        super();
        this.state = {
            regInfo: {},
            totalReg: {},
            ideas: {},
            contributionAmount: '',
            firstName: '',
            lastName: '',
            giftSelection: 'selectGift',
            contributionForm: false,
            myRef: null,
        }
    }
    
    componentDidMount() {
        const registryId = this.props.match.params.registry_id;//registryId now available in params
        regRef.on('value', (snapshot) => {
            if (snapshot.val() !== null) {
                this.setState({
                    totalReg: snapshot.val(), //All registries
                    regInfo: snapshot.val()[registryId] || {}, //saved snapshot in regInfo 
                }, () => {
                    this.setState({
                        ideas: this.state.regInfo.Ideas || {}
                    })
                })
            }
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.guestId !== prevProps.guestId) {
            this.setState({
                regInfo: this.state.totalReg[this.props.guestId],
                ideas: this.state.totalReg[this.props.guestId].Ideas || {}
            })
        }
    }

    componentWillUnmount() {
        regRef.off();
    }

    toggleContributionForm = () => {
        this.setState({
            contributionForm: !this.state.contributionForm
        })
    }

    scrollRef = () => {
        if (this.state.myRef) {
            window.scrollTo({
                top: this.state.myRef.offsetTop,
                behavior: "smooth"
            })
        } else {
            window.scrollTo({
                top: -50,
                behavior: "smooth"
            })
        }
    }

    //Create ref to the idea form
    setFormref = element => {
        this.setState({
            myRef: element
        }, () => {
            this.scrollRef();
        })
    }

    handleInputChange = e => {
        if (e.target.id === 'contributionAmount') {
            //User would only be allowed to enter valid dollar amounts 
            if (/^([0-9]+)([.]{0,1})([0-9]){0,2}$|^()$/g.test(e.target.value)) {
                this.setState({
                    [e.target.id]: e.target.value
                })
            }
        } else {
            this.setState({
                [e.target.id]: e.target.value
            })
        }  
    }

    handleSubmit = e => {
        e.preventDefault();
        const updatedAmounts = Object.entries(this.state.ideas).filter(idea => {
            return (
                this.state.giftSelection === idea[1].ideaName
            )
        })
        this.setState({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            giftSelection: this.state.giftSelection,
            contributionAmount: this.state.contributionAmount,
        }, () => {
            // create an object of the user inputs when they contribute
            const contributor = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                contributionAmount: this.state.contributionAmount,
            }


            // updating balance/contributions/contributors
            updatedAmounts[0][1].balance = parseFloat(updatedAmounts[0][1].balance) - parseFloat(this.state.contributionAmount);
            //If balance is less than 0, set the balance to 0.00
            updatedAmounts[0][1].balance = updatedAmounts[0][1].balance < 0 ? '0.00' : updatedAmounts[0][1].balance.toFixed(2);

            updatedAmounts[0][1].contributions = parseFloat(updatedAmounts[0][1].contributions) + parseFloat(this.state.contributionAmount);
            updatedAmounts[0][1].contributions = updatedAmounts[0][1].contributions.toFixed(2);

            // push the balance and contribution updates to "All Registries" in firebase
            regRef.child(this.props.match.params.registry_id).child("Ideas").child(updatedAmounts[0][0]).set(updatedAmounts[0][1]);
                        
            regRef.child(this.props.match.params.registry_id).child("Ideas").child(updatedAmounts[0][0]).child("Contributors").push(contributor);
            // pull the userId that corresponds to this registry from the database
            regRef.child(this.props.match.params.registry_id).child("userId").once("value", (snapshot) => {
                this.userId = snapshot.val()
            })

            // push the updates made in "All Registries" for balance and contributions into the associated userId
            userRef.child(this.userId).child("Registries").child(this.props.match.params.registry_id).child("Ideas").child(updatedAmounts[0][0]).set(updatedAmounts[0][1]);

            userRef.child(this.userId).child("Registries").child(this.props.match.params.registry_id).child("Ideas").child(updatedAmounts[0][0]).child("Contributors").push(contributor)
            
            this.setState({
                contributionAmount: '',
                firstName: '',
                lastName: '',
                giftSelection: 'selectGift'
            })
        })
        this.toggleContributionForm()
    }

    render() {
        return (
            <div className="guestPage">

                <GoBackToRegistriesDashNav/>
                <header className="registryHeader">
                    <div className="innerWrapper headerContent">
                        <h2>{this.state.regInfo.name} Wish List</h2>
                        <p className="names">{this.state.regInfo.p1FirstName} & {this.state.regInfo.p2FirstName}</p>
                        <p>{this.state.regInfo.date}</p>
                    </div>
                </header> 
          
                <div className="guestPageIdeas">
                    <p className="innerWrapper guestPageInstructions">Click the button at the bottom of the screen and fill out the form to contribute to one or more of the items in the wish list below.</p>
                    <ul className="innerWrapper guestPageAllIdeas">
                        {Object.entries(this.state.ideas).length <= 0
                        ?
                        <div className="noWishList">
                            <h3>Uh oh, there's currently nothing in this wish list</h3>
                            <svg x="0px" y="0px" viewBox="0 0 100 100"><path d="M50,20c16.569,0,30,13.431,30,30S66.569,80,50,80S20,66.569,20,50S33.431,20,50,20 M50,15  c-19.299,0-35,15.701-35,35s15.701,35,35,35s35-15.701,35-35S69.299,15,50,15L50,15z" /><circle cx="62" cy="43.999" r="5" /><circle cx="38.002" cy="43.999" r="5" /><path d="M65.414,66.827c-0.588,0-1.178-0.206-1.653-0.626c-3.802-3.355-8.688-5.204-13.761-5.204s-9.959,1.849-13.761,5.204  c-1.035,0.914-2.615,0.814-3.528-0.22c-0.914-1.035-0.815-2.614,0.22-3.528C37.646,58.29,43.708,55.997,50,55.997  c6.292,0,12.354,2.293,17.069,6.456c1.035,0.914,1.134,2.493,0.22,3.528C66.795,66.541,66.106,66.827,65.414,66.827z" />
                                {/* Created by Daouna Jeong from the Noun Project */}
                            </svg>
                        </div>
                        :
                        Object.entries(this.state.ideas).map(idea => {
                            return(
                                <li key={idea[0]} className={`ideaContainer ${idea[1].ideaCategory}`}>
                                    <div className="ideaContent">
                                        <h3 className="ideaName">{idea[1].ideaName}</h3>
                                        <div className="guestPageP">
                                            <p className="cost"><span>Total Cost: </span>${idea[1].cost}</p>
                                            <p><span>Updated Balance: </span>${idea[1].balance}</p>
                                        </div>
                                        {/* <p className="description">{idea[1].description}</p> */}
                                    </div>
                                </li>
                            )
                        })
                        }
                    </ul>
                </div>

                { this.state.contributionForm
                ?
                <div>
                    <button className="ideaButton closeIdea" onClick={this.toggleContributionForm}>
                        <FontAwesomeIcon icon={faTimes} className="registryIcon" aria-hidden title="minimize idea form" />
                        <span className="visuallyhidden">Minimize contribution form</span>
                    </button>

                    <form className="contributionAmount outerWrapper" ref={this.setFormref} onSubmit={this.handleSubmit}>
                        <label htmlFor="firstName">First name:</label>
                        <input value={this.state.firstName} id="firstName" type="text" onChange={this.handleInputChange} required />
    
                        <label htmlFor="lastName">Last name:</label>
                        <input value={this.state.lastName} id="lastName" type="text" onChange={this.handleInputChange} />
    
                        <label htmlFor="giftSelection">Select a gift:</label>
                        <select value={this.state.giftSelection} id="giftSelection" onChange={this.handleInputChange} required>
                            <option value="selectGift" disabled>Select gift</option>
                            {Object.entries(this.state.ideas)
                                .filter(idea => {
                                    return idea[1].balance > 0.00;
                                })
                                .map(idea => {
                                    return (
                                        <option key={idea[0]} value={idea[1].ideaName}>{idea[1].ideaName}</option>
                                    )
                                })}
                        </select>
    
                        <label htmlFor="contributionAmount">Your gift amount:</label>
                        <input id="contributionAmount" value={this.state.contributionAmount} type="text" onChange={this.handleInputChange} required />
    
                        <input type="submit" value="Send Gift"/>
                    </form>
                </div>
                :
                <button className="ideaButton createIdea" onClick={this.toggleContributionForm}>
                    <FontAwesomeIcon icon={faTimes} className="registryIcon rotatedIcon" aria-hidden title="create new gift idea" />
                    <span className="visuallyhidden">Contribute to a new gift</span>
                </button>
                }
            </div>
        )
    }
}

// export default GuestPage;
export default withRouter(GuestPage);