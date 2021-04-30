import React, {Component, Components} from 'react'
import axios from 'axios'
import Stats from './Stats'

class Grid extends Component{
    constructor(){
        super();

        this.state = {
            backgroundGrid: [],
            gridHeight: 30,
            gridWidth: 50,
            activeShipId: 0
        }

        this.newTurn = this.newTurn.bind(this)
        this.displayBoard = this.displayBoard.bind(this)
        this.displayRange = this.displayRange.bind(this)
        this.updateShip = this.updateShip.bind(this)
        this.cleanGrid = this.cleanGrid.bind(this)
        this.addFighter = this.addFighter.bind(this)
        this.cleanOldSpot = this.cleanOldSpot.bind(this)
    }

    componentDidMount(){

        //When the game first loads, this will create a grid of the right size
        let grid = [];
        for(let i = 0; i < this.state.gridHeight; i++){
            grid.push([]);
            for(let j = 0; j < this.state.gridWidth; j++){
                grid[i].push(0);
            }
        }
        this.setState({backgroundGrid: grid})

        this.newTurn(grid);
        this.displayBoard();


    }

    //This function accesses the board and returns divs with the right classes
    displayBoard(id){
        
        return (this.state.backgroundGrid.map((elx, ix) => {
                    return (
                        <div className="column">
                            {elx.map((ely, iy) => {
                                    if(ely === 0){
                                        return(
                                            <div className="empty"></div>
                                        )
                                    } else if(ely > 20 && ely < 30){
                                        //This elseif will check to see if the value represents the id of a friendly fighter
                                        return(
                                            <div className="player-fighter" onClick={() => {this.displayRange(ix, iy, ely)}}>
                                                {ely}
                                                {/* Remember to make an axios call with the given ID to get the ships health here 
                                                    Also needs to add an onlick to call range function*/}
                                            </div>
                                        )
                                    } else if(ely > 70 && ely < 90){
                                        return(
                                            <div className="enemy-fighter">
                                                {ely}
                                                {/* Need to make axios call to display enemy health here */}
                                            </div>
                                        )
                                    } else if(ely === 4){
                                        return(
                                            <div className="player-range" onClick={() => {this.updateShip(ix, iy, this.state.activeShipId)}}>
                                                {/* Add onclick to call update ship function, passing id, ix, and iy */}
                                            </div>
                                        )
                                    }
                                

                            })}
                        </div>
                    )
                    //end of elxmap

                })

        )

    }

    cleanOldSpot(posY, posX, id){

                
                
    }

    updateShip(posY, posX, id){

        let grid =  [...this.state.backgroundGrid];

        //getting the previous location so we can delete it
        let shipArray;
        let oldX;
        let oldY;

        console.log("update ship ran")
        axios.get('/api/ships')
        .then((res) => {
            console.log(res)
            shipArray = [...res.data];
            for(let i = 0; i < shipArray.length; i++){
                if(id == shipArray[i].id){
                    oldY = shipArray[i].posX;
                    oldX = shipArray[i].posY;
                    console.log("oldx is " + oldX);
                    grid[oldY][oldX] = 4;
                }
            }
        })
        .catch((err) => {
            console.log(err)
        })
        this.setState({backgroundGrid: grid})
        this.displayBoard();        
        
        //Updating backend with the ship's new location
        console.log(posY, posX, id);
        axios.put(`api/ships/${id}`, {posY, posX})
        .then((res) => {console.log(res)})
        .catch((err) => {console.log(err)})

        grid[posY][posX] = id;
        this.setState({backgroundGrid: grid});
        this.displayBoard();


    }

    //this cleanses the array and refreshes it with the now-updated positions of the fighters
    newTurn(passingGrid){
        let grid = passingGrid ? passingGrid : [...this.state.backgroundGrid]
        console.log("In theory this should clean the array")
        grid.map((elx, ix) => {
            elx.map((ely, iy) => {
                ely = 0;
                
            })
        })


        let shipArray = [];
        axios.get('/api/ships')
        .then((res) => {
            shipArray = [...res.data];

            //After I get the data from my backend, I can update my array in the right places
            for(let i = 0; i < shipArray.length; i++){
                grid[shipArray[i].posY][shipArray[i].posX] = shipArray[i].id;
            }
            
            this.setState({backgroundGrid: grid})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    cleanGrid(){
        let grid = [...this.state.backgroundGrid]

        for(let i = 0; i < grid.length; i ++){
            for( let j = 0; j < grid[i].length; j++){
                grid[i][j] = 0;
            }
        }



        let shipArray = [];
        axios.get('/api/ships')
        .then((res) => {
            shipArray = [...res.data];

            //After I get the data from my backend, I can update my array in the right places
            for(let i = 0; i < shipArray.length; i++){
                grid[shipArray[i].posY][shipArray[i].posX] = shipArray[i].id;
            }
            
            this.setState({backgroundGrid: grid})
        })
        .catch((err) => {
            console.log(err)
        })

        this.setState({backgroundGrid: grid})


    }


    //This function highlights a ships attack and movement ranges
    displayRange(posY, posX, id){

        
        console.log("onclick still works")

        let range = 5;
        let right = 49 - posX;
        let left = posX;
        let top = posY;
        let bottom = 29 - posY;

        let grid = [...this.state.backgroundGrid];

        for(let i = 0; i < range; i++){

            grid[posY + i][posX] = 4;
            grid[posY + (i - (range - 2))][posX + 1] = 4;
            grid[posY + (i - 1)][posX + 1] = 4;
            grid[posY + (i - (range - 3))][posX + 2] = 4;
            grid[posY + (i - 2)][posX + 2] = 4;
            grid[posY + 1][posX + 3] = 4;
            grid[posY - 1][posX + 3] = 4;

            grid[posY + i][posX] = 4;
            grid[posY + (i - (range - 2))][posX - 1] = 4;
            grid[posY + (i - 1)][posX - 1] = 4;
            grid[posY + (i - (range - 3))][posX - 2] = 4;
            grid[posY + (i - 2)][posX - 2] = 4;
            grid[posY + 1][posX - 3] = 4;
            grid[posY - 1][posX - 3] = 4;

            grid[posY - i][posX] = 4;
            grid[posY][posX + i] = 4;
            grid[posY][posX - i] = 4;

            grid[posY][posX] = id;
            this.setState({activeShipId: id})

        }

        this.setState({backgroundGrid: grid})

    }

    addFighter(posX, posY){

        axios.post('/api/ships', {posX, posY})
        .then((res) => {
            console.log("New fighter added")
        })
        .catch((err) => {
            console.log(err)
        })


    }

    render(){


        return(
            <div>
                {this.displayBoard()}
                <button onClick={() => this.cleanGrid()}>New Turn</button>
                <button onClick={() => this.addFighter(30,10)}>New Fighter</button>
                <Stats/>
            </div>
            
        )
    }
}

export default Grid;