const express = require('express');

const app = express();
const PORT = 4609;

const shipControl = require('./controllers/ShipController');

app.use(express.json());

app.listen(PORT, () => console.log("Server is running on port " + PORT))

app.get('/api/ships', shipControl.getShips);
app.put('/api/ships/:id', shipControl.editShip)
app.post('/api/ships', shipControl.addShip)
