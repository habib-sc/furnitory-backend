const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const app = express();

//Middlewear
app.use(cors());
app.use(express.json());

//Root endpoint 
app.get('/', (req, res) => {
    res.send("Furnitory");
});

// MongoDB connection info 
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@clusterfurnitory.ckxfa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try {
        // DB Connection 
        await client.connect();
        const itemsCollection = client.db('Furnitory').collection('Items');

        // Items get endpoint 
        app.get('/items', async (req, res) => {
            const query = {};
            const items = itemsCollection.find(query);
            const result = await items.toArray();
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(console.dir);

//Server running
app.listen(port, () => {
    console.log('Server is running on port', port);
});