import React, {Component, Components} from 'react'

class Header extends Component{
    constructor(){
        super();
    }

    render(){


        return(
            <div className="header">
                <div></div>
                <div className="center-title">Nautilus Space Fighter</div>
                <div className="login">Login</div>
            </div>
            
        )
    }
}

export default Header;