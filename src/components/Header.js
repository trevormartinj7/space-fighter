import React, {Component, Components} from 'react'

class Header extends Component{
    constructor(){
        super();
    }

    render(){


        return(
            <header className="header">
                <div></div>
                <div className="center-title">Nautilus Space Fighter</div>
                <div className="login">Login</div>
            </header>
            
        )
    }
}

export default Header;