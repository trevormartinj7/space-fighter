import React, {Component} from 'react'
import axios from 'axios'
import Stats from './Stats'
import playership from './playership.png'
import galaxybackground from './background.jpeg'
import enemyship from './enemyship.png'
import targetedship from './enemyshiptargeted.png'

class Grid extends Component{
    constructor(){
        super();

        this.state = {
            backgroundGrid: [],
            gridHeight: 30,
            gridWidth: 50,
            activeShipId: 0,
            money: 0,
            gameOver: false,
            wave: 1,
            friendId: 24,
            enemyId: 74,
            subwave: 1,
        }


        //Binding my functions
        this.newTurn = this.newTurn.bind(this)
        this.displayBoard = this.displayBoard.bind(this)
        this.displayRange = this.displayRange.bind(this)
        this.updateShip = this.updateShip.bind(this)
        this.cleanGrid = this.cleanGrid.bind(this)
        this.addFighter = this.addFighter.bind(this)
        // this.cleanOldSpot = this.cleanOldSpot.bind(this)
        this.enemyInRange = this.enemyInRange.bind(this)
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

        //This initializes all the ships in their starting locations
        this.newTurn(grid);
        this.displayBoard();


    }

    //this function is only called when initializing the array for the first time (I think?)
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

    //the displayBoard function is the beating heart of my entire game. It checks the array and returns 
    // divs with classes that my css interprets to allow players to see ships/ranges
    //The divs also have onclicks that trigger functions further on in my code. These onclicks include
    //displayrange, attackships, and movetonewlocations
    //elx is a sub array, and ely is the value that's being read in my if statements.
    //ely could be 0 (empty), 4 (friendly ship's range), 20-30 (friendly ship), or 70-80 (enemy ship). 
    displayBoard(){
        //Mapping over the array
        return (this.state.backgroundGrid.map((elx, ix) => {
                    return (
                        <div className="column">
                            {elx.map((ely, iy) => {
                                    //Outputting an empty div if there's nothing there, no onclick
                                    if(ely === 0){
                                        return(
                                            <div className="empty"></div>
                                        )
                                    } else if(ely > 20 && ely < 30){
                                        //This elseif will check to see if the value represents the id of a friendly fighter
                                        //The div it outputs contains an onclick that calls the function which displays the range of the fighter
                                        return(
                                            <div className="player-fighter" >
                                                <img className="small-ship" onClick={() => {this.displayRange(ix, iy, ely)}} src={playership}></img>
                                                
                                                 {/* {ely} */}
                                                {/* Remember to make an axios call with the given ID to get the ships health here 
                                                    Also needs to add an onlick to call range function*/}
                                            </div>
                                        )
                                    } else if(ely > 70 && ely <= 99){
                                        //This elseif checks to see if the ID matches an enemy fighter
                                        //The onlick it outputs checks to see if a friendly fighter is in attack range
                                        return(
                                            <div className="enemy-fighter">
                                                <img src={enemyship} className="enemy-ship-image" />
                                                {/* Need to make axios call to display enemy health here */}
                                            </div>
                                        )
                                    } else if (ely > 99 && ely < 130) {
                                        //This occurs when an enemy ship is targetable. 
                                        return(
                                            <div className="targetable" onClick={() => {this.enemyInRange(ix, iy, ely)}}>
                                                <img src={targetedship} className="enemy-ship-image" />
                                            </div>
                                        )
                                    }else if(ely === 4){
                                        //This outputs "range" divs that the player can then click to move to.
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

    //This function runs when a range tile is clicked by the user
    updateShip(posY, posX, id){

        //This checks to see whether the ship that was fed into the function has already
        //moved this turn or not
        let alreadyMoved = false;
        let myShipArray = [];

        axios.get('/api/ships')
        .then((res) => {
            myShipArray = [...res.data];
            console.log("I'm checking to see if anything is inside " + myShipArray)
            console.log(myShipArray)
            console.log("AAAGHHH THE UPDATE SHIP FUNCTION IS ABOUT TO RUN THROUGH MY SHIP ARRAY " + myShipArray.length + " times")

             //Here is my loop searching for the specific ship so I can check it's moved value
            for(let i = 0; i < myShipArray.length; i++){
                console.log(id + myShipArray[i].id)
                if(id == myShipArray[i].id){
                    console.log("The ship " + myShipArray[i].id + " has moved is " + myShipArray[i].moved)
                    alreadyMoved = myShipArray[i].moved;
                }
            }

            if(!alreadyMoved){

                let grid =  [...this.state.backgroundGrid];
    
                //getting the previous location so we can delete it
                let shipArray;
                let oldX;
                let oldY;
        
                //This should replace the old spot with a blue square
                console.log("update ship ran")
                axios.get('/api/ships')
                .then((res) => {
                    console.log(res)
                    shipArray = [...res.data];
                    for(let i = 0; i < shipArray.length; i++){
                        if(id == shipArray[i].id){
                            oldX = shipArray[i].posX;
                            oldY = shipArray[i].posY;
                            console.log("oldx is " + oldX);
                            grid[oldY][oldX] = 4;
        
                            //uncomment these
                            this.setState({backgroundGrid: grid})
                            // this.displayBoard();   
                        }
                    }
        
        
                })
                .catch((err) => {
                    console.log(err)
                })
             
                //This sometimes glitches and sometimes works great, not entirely sure why
                
                //Updating backend with the ship's new location and marking moved attribute as
                let moved = true;
                console.log(posY, posX, id, moved);
                axios.put(`api/ships/${id}`, {posY, posX, moved})
                .then((res) => {
                    grid[posY][posX] = id;
                    this.setState({backgroundGrid: grid});
                    //and this one
                    // this.displayBoard();
                    console.log(res);
                })
                .catch((err) => {console.log(err)})
        
        
            } else{
                alert("That ship has already moved this turn");
            }







        })
        .catch((err) => {
            console.log(err)
        })

     



        
    }


    //This function runs when the "New turn" button is clicked. It cleans the array of all range shennanigans
    //and resets the array with the positions grabbed from the backend
    //It also sets the "moved" attribute to false again so the ships can move again
    //It will also move the enemy ships down and check to see if they've reached the earth

    cleanGrid(){

        console.log("New turn happened")
        let grid = [...this.state.backgroundGrid]

        //First I set the entire 2d array to 0
        for(let i = 0; i < grid.length; i ++){
            for( let j = 0; j < grid[i].length; j++){
                grid[i][j] = 0;
            }
        }


        //Here I get the x and y location of all ships from my backend and update my array with those values
        let shipArray = [];
        axios.get('/api/ships')
        .then((res) => {
            shipArray = [...res.data];

            //After I get the data from my backend, I can update my temp array in the right places
            for(let i = 0; i < shipArray.length; i++){
                grid[shipArray[i].posY][shipArray[i].posX] = shipArray[i].id;
            }
            
            //And I finally set the state of my grid to my temp array
            this.setState({backgroundGrid: grid})


            //underneath here, I call the edit function to update the move attribute
            //so that it's reset for the next turn

            let moved = false;

            for(let i = 0; i < shipArray.length; i++){
                let posY = shipArray[i].posY;
                let posX = shipArray[i].posX;
                let id = shipArray[i].id;
                console.log("The for loop ran at least once insine new turn")
    
                axios.put(`api/ships/${id}`, {posY, posX, moved})
                .then((res) => {
                    // grid[posY][posX] = id;
                    // this.setState({backgroundGrid: grid});
                    //and this one
                    // this.displayBoard();
                    console.log("REEEEEE You should always see false in this result: " + res);
                })
                .catch((err) => {console.log(err)})
            }


       
            axios.get('/api/ships')
            .then((res) => {
                shipArray = res.data;
                //Making the enemy ships go down
                for(let i = 0; i < shipArray.length; i++){

                    let yChange = Math.floor(Math.random() * 6);
                    

                    let posY = shipArray[i].posY + yChange;
                    let posX = shipArray[i].posX;
                    let id = shipArray[i].id;
                    let moved = false;

                    if(shipArray[i].id > 70){
                        axios.put(`api/ships/${id}`, {posY, posX, moved})
                        .then((res) => {
                            console.log("ENEMY SHIPS MOVED DOWN")
                        })
                        .catch((err) => {console.log(err)})
                    }

                

                }
            })
            .catch((err) => console.log(err))

            for(let i = 0; i < shipArray.length; i++){
                if(shipArray[i].id > 70 && shipArray[i].posY > 26){
                    this.setState({gameOver: true})
                }
            }

            //This will potentially spawn a random enemy fighter 

            let incSubWave = this.state.subwave;
            let incWave = this.state.wave;
            incSubWave += 1;
            if(incSubWave > 5){
                incWave += 1;
                incSubWave = 0;
            }

            for(let i = 0; i < incWave; i++){
                let posX = Math.floor(Math.random() * 48)
                let posY = Math.floor(Math.random() * 5)
                let id = this.state.enemyId;

                axios.post('/api/ships', {posX, posY, id})
                .then((res) => {
                    console.log("New fighter added")
                    id += 1;
                    this.setState({enemyId: id})
                    this.setState({wave: incWave})
                    this.setState({subwave: incSubWave})
                })
                .catch((err) => {
                    console.log(err)
                })
            }

       
       
       
       
       
        })
        .catch((err) => {
            console.log(err)
        })

 

        //Here is where all the enemy ships

    

    }


    //This function is called when the player clicks on one of their ships 
    //It highlights the given ship's attack and movement ranges
    //Right now it covers up any friendly or enemy ship, which is bad
    //I need to implement a check so that I don't accidentally do that for friendlys
    //and make it so that it turns enemies into destroyable objects

    //Screw it, ships can fly in squares now
    //posY, posX, and id all match the specific ship being clicked on

    displayRange(posY, posX, id){

        console.log("onclick still works")

        let range = 4;
        let right = 49 - posX;
        console.log("The clicked shp is " + right + " tiles away from the right edge")
        let left = posX;
        let top = posY;
        let bottom = 29 - posY;

        let grid = [...this.state.backgroundGrid];


        //Ok, this checks if you're too close to a wall then displays the range
        //If it's too close to a wall, it runs down the else if statements to find which wall
        //Then it uses the distance to the wall as its range
        if(right > range && left > range && top > range && bottom > range){
            for(let i = 0; i < (range*2 - 1); i++){
                for(let j = 0; j < (range*2 - 1); j++){
                    grid[(posY - (range -1)) + i][(posX - (range - 1)) + j] = 4;
                }
            }
        } else if(left < range){
            for(let i = 0; i < (range*2 - 1); i++){
                for(let j = 0; j < (range + left - 1); j++){
                    grid[(posY - (range -1)) + i][(posX - (left)) + j] = 4;
                }
            }
        } else if(right < range){
            for(let i = 0; i < (range*2 - 1); i++){
                for(let j = 0; j < (range + right); j++){
                    grid[(posY - (range -1)) + i][(posX - (range - 1)) + j] = 4;
                }
            }
        }  else if(top < range){
            for(let i = 0; i < (range + top); i++){
                for(let j = 0; j < (range*2 - 1); j++){
                    grid[(posY - top) + i][(posX - (range - 1)) + j] = 4;
                }
            }
        } else if(bottom < range){
            for(let i = 0; i < (range + bottom + 1); i++){
                for(let j = 0; j < (range*2 - 1); j++){
                    grid[(posY - range) + i][(posX - (range - 1)) + j] = 4;
                }
            }
        }

        //This basically makes sure I haven't overwritten any ships with range tiles
        axios.get('/api/ships')
        .then((res) => {
            let shipArray = [...res.data];
            for(let i = 0; i < shipArray.length; i++){
                console.log("Checking to see if any ships have moved: " + shipArray[i].moved);
                //This checks to see if there's an enemy ship within the range tiles
                if(grid[shipArray[i].posY][shipArray[i].posX] === 4 && shipArray[i].id > 70){
                    //I should probably update the array in the position where the enemy ship is so that it gets a different color
                    //and an onclick that can destroy it.
                    //Before I implement that though, I think I need to implement a mini clear after the
                    //player moves their ship
                    //That will happen inside of the onclick for the range tiles though.

                    grid[shipArray[i].posY][shipArray[i].posX] = shipArray[i].id + 30;
                    this.setState({backgroundGrid: grid})
                } else if(grid[shipArray[i].posY][shipArray[i].posX] === 4 && shipArray[i].id < 70){
                    grid[shipArray[i].posY][shipArray[i].posX] = shipArray[i].id;
                    this.setState({backgroundGrid: grid})
                }
            }
        })
        .catch((err) => {
            console.log(err)
        })



        //This section """dynamically""" creates a range around my fighters. 
        //There must be a better way to do this, but I couldn't see it

        // for(let i = 0; i < range; i++){

        //     grid[posY + i][posX] = 4;
        //     grid[posY + (i - (range - 2))][posX + 1] = 4;
        //     grid[posY + (i - 1)][posX + 1] = 4;
        //     grid[posY + (i - (range - 3))][posX + 2] = 4;
        //     grid[posY + (i - 2)][posX + 2] = 4;
        //     grid[posY + 1][posX + 3] = 4;
        //     grid[posY - 1][posX + 3] = 4;

        //     grid[posY + i][posX] = 4;
        //     grid[posY + (i - (range - 2))][posX - 1] = 4;
        //     grid[posY + (i - 1)][posX - 1] = 4;
        //     grid[posY + (i - (range - 3))][posX - 2] = 4;
        //     grid[posY + (i - 2)][posX - 2] = 4;
        //     grid[posY + 1][posX - 3] = 4;
        //     grid[posY - 1][posX - 3] = 4;

        //     grid[posY - i][posX] = 4;
        //     grid[posY][posX + i] = 4;
        //     grid[posY][posX - i] = 4;

        //     grid[posY][posX] = id;

        //     //This bit is important: 
        //     //It tells me which ship the player just clicked on so I know which ship to move
            

        // }

        this.setState({activeShipId: id})
        this.setState({backgroundGrid: grid})

    }

    addFighter(posX, posY){

        let id = this.state.friendId;


        axios.post('/api/ships', {posX, posY, id})
        .then((res) => {
            console.log("New fighter added")
            id += 1;
            this.setState({friendId: id});
            let fighterCost = this.state.money;
            fighterCost = fighterCost - 10;
            this.setState({money: fighterCost})
        })
        .catch((err) => {
            console.log(err)
        })


    }

    enemyInRange(posY, posX, id){
        console.log("Enemy in range function works " + id)
        let shipArray = [];

        axios.get('/api/ships')
        .then((res) => {
            shipArray = [...res.data];


            let friendArray = [];
            for(let i = 0; i < shipArray.length; i++){
                if(shipArray[i].id < 30){
                    friendArray.push(shipArray[i]);
                }
            }


            

            for(let i = 0; i < friendArray.length; i++){
                if((Math.abs(friendArray[i].posY - posY) < 5) && (Math.abs(friendArray[i].posX - posX) < 5)){
                    console.log("ship would've been destroyed");
                    axios.delete(`/api/ships/${id - 30}`)
                    .then((res) => {
                        console.log(id + "was destroyed!");
                        let grid = this.state.backgroundGrid;
                        grid[posY][posX] = 4;
                        this.setState({backgroundGrid: grid})
                        let earnedMoney = this.state.money;
                        earnedMoney += 5;
                        this.setState({money: earnedMoney})
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                }
            }






        })
        .catch((err) => {
            console.log(err)
        })




        //We got a couple of ways to do this. We can check each friendly fighter
    }

    render(){


        return(
            <div className="body">
                <img className="game-background" src={galaxybackground}/>
                <div className="grid-game-board">
                    {this.displayBoard()}
                </div>

                {this.state.gameOver && <div className="big-game-over">Game Over! You destroyed {this.state.money/5} fighters.</div>}

                <div className="side-box">
                        <Stats monies={this.state.money} shipId={this.state.activeShipId} cleanGrid={this.cleanGrid} addFighter={this.addFighter}/>
             
                </div>
            </div>
            
        )
    }
}

export default Grid;