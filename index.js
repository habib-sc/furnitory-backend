const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;

const app = express();

//Middlewear
app.use(cors());
app.use(express.json());

//Root endpoint 
app.get('/', (req, res) => {
    res.send("Furnitory");
});


//Server running
app.listen(port, () => {
    console.log('Server is running on port', port);
});