const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const usersCollection= client.db('Furnitory').collection('Users');
        const blogsCollection = client.db('Furnitory').collection('Blogs');

        // Item Section =========================================================
        // Item get endpoint 
        app.get('/items', async (req, res) => {
            const email = req.query.email;
            let query;
            if (email) {
                // query for getting data by email 
                query = {addedBy: email};
            }else {
                // query for getting all data 
                query = {};
            }
            const items = itemsCollection.find(query);
            const result = await items.toArray();
            res.send(result);
        });

        // Item detail endpoint 
        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const result = await itemsCollection.findOne(filter);
            res.send(result);
        });

        // Item post endpoint
        app.post('/item/add', async (req, res) => {
            const item = req.body;
            const result = await itemsCollection.insertOne(item);
            res.send(result);
        });

        // Item update endpoint
        app.put('/item/update/:id', async (req, res) => {
            const id = req.params.id;
            const newItemData = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updateDoc = {
                $set: {...newItemData}
            }
            const result = await itemsCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        // Item delete endpoint
        app.delete('/item/delete/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const result = await itemsCollection.deleteOne(filter);
            res.send(result);
        });

        // Users Section =======================================================
        // user post
        app.post('/user/add', async (req,res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        // Blog Section ==============================================================
        // blog post 
        app.post('/blog/add', async (req, res) => {
            const blog = req.body;
            const result = await blogsCollection.insertOne(blog);
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