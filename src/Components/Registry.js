import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import firebase from '../firebase';
import Ideas from './Ideas';
import IdeaForm from './IdeaForm';
import IdeaPopUp from './IdeaPopUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const regRef = firebase.database().ref('/All Registries')

class Registry extends Component {
    constructor(){
        super();
        this.state = {
            regObject: {},
            ideaName:'',
            ideaCategory: 'wedding',
            cost: '',
            description: '',
            regObjectAvailable: false,
            ideas: {},
            ideaPopUp: false,
            ideaForm: false,
            myRef: null,
            
        }
    }

    componentDidMount () {
        // After the registries object is passed as props, we use the registry_id (from the link url), to get the correct registry object
        const registryId = this.props.match.params.registry_id;
        this.setState({
            regObject: this.props.registries[registryId]
        }, () => {
            this.setState({
               regObjectAvailable: true,
               dbRef: this.props.dbRef
            }, () => {
               this.state.dbRef.child(`Registries/${registryId}`).child("Ideas").on("value", (snapshot) => {
                  this.setState({
                     ideas: snapshot.val() || {}
                  })
               })
            })
        })
        
    }

    componentWillUnmount() {
        this.state.dbRef.child(`Registries/${this.props.match.params.registry_id}`).child("Ideas").off();
    }

    
    //Toggles ideaForm boolean in state after clicking +
    toggleIdeaForm = () => {
        this.setState({
            ideaForm: !this.state.ideaForm
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

    handleInputChange = (e) => {
        if (e.target.id === 'cost') {
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


    handleSubmit = (e) => {
        e.preventDefault();
        const ideaObj = {
            ideaName: this.state.ideaName,
            ideaCategory: this.state.ideaCategory,
            cost: parseFloat(this.state.cost).toFixed(2),
            description: this.state.description,
            contributions: 0,
            balance: parseFloat(this.state.cost).toFixed(2),
            contributors: {},
      }
      //Add a registry to the Registries node in firebase
      const ideaKey = this.props.dbRef.child(`Registries/${this.props.match.params.registry_id}`).child('Ideas').push(ideaObj).key 

      regRef.child(this.props.match.params.registry_id).child('Ideas').child(ideaKey).set(ideaObj);
      
      this.setState({
         ideaName: '',
         ideaCategory: 'travel',
         cost: '',
         description: '',
         ideaPopUp: false,
      })

      this.toggleIdeaForm();

    }

    handleClickIdea = key => {
        this.setState({
            ideaKey: key,
            ideaPopUp: !this.state.ideaPopUp
        })
    }

    handleDeleteIdea = key => {

        confirmAlert({
            customUI: ({ onClose }) => {
               return (
                  <div className="deleteAlert">
                     <p>Are you sure that you want to delete this idea</p>
                     <button onClick={onClose}>No</button>
                     <button onClick={() => {
                        //Delete idea from associated registry in user node
                        this.props.dbRef.child(`Registries/${this.props.match.params.registry_id}`).child('Ideas').child(key).remove();
                        //Delete idea from associated registry in All Registries node
                        regRef.child(this.props.match.params.registry_id).child('Ideas').child(key).remove();
                        this.props.handleUpdateFilterResults();
                        onClose();
                     }}>Yes</button>
                     </div>
               )
            }
         })

    }

    render() {
        return (
            <div className="registryDiv ideas">
                <header className="registryHeader">
                    <div className="innerWrapper headerContent">
                        <h2>{this.state.regObject.name}</h2>   
                        <p className="names">{this.state.regObject.p1FirstName} & {this.state.regObject.p2FirstName}</p>  
                        <p>{this.state.regObject.date}</p>
                    </div>
                </header>   
                <main>
                    <h2>Your Wish List</h2>
                    <ul className="ideasContainer outerWrapper">
                        {this.state.regObjectAvailable
                            ?
                            Object.entries(this.state.ideas).length > 0
                                ?
                                Object.entries(this.state.ideas).map(idea => {
                                    return (
                                        <li key={idea[0]} className={`ideaListItem`}>
                                            <div className={idea[1].ideaCategory}></div>
                                            <Ideas
                                                ideaName={idea[1].ideaName}
                                                handleClickIdea={this.handleClickIdea}
                                                handleDeleteIdea={this.handleDeleteIdea}
                                                ideaKey={idea[0]}
                                            />
                                        </li>
                                    )
                                })
                                :
                                <div className="noGiftIdeas">
                                    <h3>You currently have nothing in your wish list</h3>
                                    <svg x="0px" y="0px" viewBox="0 0 100 100"><path d="M50,20c16.569,0,30,13.431,30,30S66.569,80,50,80S20,66.569,20,50S33.431,20,50,20 M50,15  c-19.299,0-35,15.701-35,35s15.701,35,35,35s35-15.701,35-35S69.299,15,50,15L50,15z" /><circle cx="62" cy="43.999" r="5" /><circle cx="38.002" cy="43.999" r="5" /><path d="M65.414,66.827c-0.588,0-1.178-0.206-1.653-0.626c-3.802-3.355-8.688-5.204-13.761-5.204s-9.959,1.849-13.761,5.204  c-1.035,0.914-2.615,0.814-3.528-0.22c-0.914-1.035-0.815-2.614,0.22-3.528C37.646,58.29,43.708,55.997,50,55.997  c6.292,0,12.354,2.293,17.069,6.456c1.035,0.914,1.134,2.493,0.22,3.528C66.795,66.541,66.106,66.827,65.414,66.827z" />
                                        {/* Created by Daouna Jeong from the Noun Project */}
                                    </svg>
                                </div>
                            :
                            null
                        }
                    </ul>

                {   this.state.ideaForm
                    ?
                    <div>
                        <button className="ideaButton closeIdea" onClick={this.toggleIdeaForm}>
                            <FontAwesomeIcon icon={faTimes} className="registryIcon" aria-hidden title="minimize idea form" />
                            <span className="visuallyhidden">Minimize idea form</span>
                        </button>
                        <IdeaForm
                            ideaName={this.state.ideaName}
                            handleInputChange={this.handleInputChange}
                            handleSubmit={this.handleSubmit}
                            cost={this.state.cost}
                            ideaCategory={this.state.ideaCategory}
                            description={this.state.description}
                            setFormref={this.setFormref}
                        />
                    </div>
                    :
                    <button className="ideaButton createIdea" onClick={this.toggleIdeaForm}>
                        <FontAwesomeIcon icon={faTimes} className="registryIcon rotatedIcon" aria-hidden title="create new gift idea" />
                        <span className="visuallyhidden">Create new gift idea</span>
                    </button>
                }
                      
                </main>
                
                { this.state.ideaPopUp
                ?
                Object.entries(this.state.ideas).filter(idea => {
                    return (
                        idea[0] === this.state.ideaKey
                    )
                }).map(idea => {
                    return (
                        <div key={idea[0]}>
                            <IdeaPopUp
                                ideaName={idea[1].ideaName}
                                cost={idea[1].cost}
                                balance={idea[1].balance}
                                contributors={idea[1].Contributors}
                                ideaPopUp={this.state.ideaPopUp}
                                handleClickIdea={this.handleClickIdea}
                            />
                        </div>
                    )
                })

                :
                null
                }
                
            </div>    
        )
    }
}

export default withRouter(Registry);