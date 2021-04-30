import React, {Component} from 'react'

class Stats extends Component{

    constructor(){
        super();
        this.state = {
            money: 0,
        }
    }



    render(){
        return(
            <div>
                Current Money: {this.state.money}
            </div>
        )
    }
}

export default Stats;