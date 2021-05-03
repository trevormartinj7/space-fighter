let ships = [
    {
        id: 21,
        posX: 13,
        posY: 15,
        health: 10,
        moved: false
    },
    {
        id: 22,
        posX: 10,
        posY: 12,
        health: 10,
        moved: false
    },
    {
        id: 23,
        posX: 10,
        posY: 18,
        health: 10,
        moved: false
    },
    {
        id: 71,
        posX: 33,
        posY: 11,
        health: 10,
        moved: false
    },
    {
        id: 72,
        posX: 33,
        posY: 18,
        health: 10,
        moved: false
    },
    {
        id: 73,
        posX: 38,
        posY: 15,
        health: 10,
        moved: false
    }
]

let friendId = 24;
let enemyId = 72;


module.exports = {
    getShips: (req, res) => {
        res.status(200).send(ships);
    },
    editShip: (req, res) => {
        const {id} = req.params;
        const {posX, posY, moved} = req.body;
        const index = ships.findIndex((e) => {
            return e.id === +id;
        })
        ships[index].posX = posX;
        ships[index].posY = posY;
        ships[index].moved = moved;
        res.status(200).send(ships);
    },
    addShip: (req, res) => {
        let id = friendId;
        const {posX, posY} = req.body;
        const newFighter = {
            id: id,
            posX: posX,
            posY: posY,
            health: 10
        }
        ships.push(newFighter);
        friendId++;
        res.status(200).send(ships);
    },
    deleteShip: (req, res) => {
        const {id} = req.params;
        const index = ships.findIndex((e) => {
            return e.id === +id;
        })
        ships.splice(index,1);
        res.status(200).send(ships);
    }
}