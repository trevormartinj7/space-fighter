import React, {Component} from 'react'
import playership from './playership.png'
import drake from './drake.png'
import eagle from './eagle.png'
import olivia from './olivia.png'
import hawke from './hawke.png'
import grit from './grit.png'

class Stats extends Component{

    constructor(props){
        super(props);
        this.state = {
        }
        this.cleanGridButton = this.cleanGridButton.bind(this)
        this.displayCharacter = this.displayCharacter.bind(this)
    }

    displayCharacter(shipId){

        if(shipId === 21){
            return(
                <div className="character-box">
                    <div className="character-portrait"  >
                        <img className="img-portrait" src={eagle} />
                    </div>
                    <h1>Eagle</h1>
                    <p>"We can't let a single ship past us!"</p>
                </div>
                
            )
        } else if(shipId === 22){
            return(
                <div className="character-box">
                    <div className="character-portrait"  >
                        <img className="img-portrait" src={hawke} />
                    </div>
                    <h1>Hawke</h1>
                    <p>"Their speed is pathetic"</p>
                </div>
                
            )
        } else if(shipId === 23){
            return(
                <div className="character-box">
                    <div className="character-portrait"  >
                        <img className="img-portrait" src={grit} />
                    </div>
                    <h1>Grit</h1>
                    <p>"How annoying."</p>
                </div>
                
            )
        } else if(shipId === 24){
            return(
                <div className="character-box">
                    <div className="do-character-portrait"  >
                        <img className="do-portrait" src={drake} />
                    </div>
                    <h1>Drake</h1>
                    <p>"I'm here to help!"</p>
                </div>
                
            )
        } else if(shipId === 25){
            return(
                <div className="character-box">
                    <div className="do-character-portrait"  >
                        <img className="do-portrait" src={olivia} />
                    </div>
                    <h1>Olivia</h1>
                    <p>"Drake! Don't do anything stupid!"</p>
                </div>
                
            )
        }else{
            return (
                <div className="opening-box">
                    <h2>Don't let the alien ships reach Earth!</h2>
                    <p>Remember, your ships can use each other's jump fields!</p>
                </div>
            )
        }
       


    }

    cleanGridButton(){
        this.props.cleanGrid();
    }
    


    render(){
        console.log(this.props)
        return(
            <div className="side-content">
                
                {this.displayCharacter(this.props.shipId)}

                <div className="money-box">
                    
                    
                    {/* <div className="money-track"> */}
                        <button><h1>Money: $ {this.props.monies} </h1></button>
                    {/* </div> */}
                    
                    <button className="execute" onClick={() => this.cleanGridButton()}><h1>Execute Jump</h1></button>
                    {this.props.monies > 9 && <button onClick={() => this.props.addFighter(25,28)}><h1>Launch New Fighter ($10)</h1></button>}    
                
                
                </div>



 
            </div>
        )
    }
}

export default Stats;