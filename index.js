// import { MongoClient } from 'mongodb';
const express = require("express")
const app = express()

const PORT = process.env.PORT || 3001;
const cors = require("cors")
// username: subhashprasad52468
// password: d8aK8KQbBMezi2Ze
require('dotenv').config()
// console.log(process.env.DB_USER)
// middlewares
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jiex7f2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        // Database and Collection

        const menuCollections = client.db("FoodAppWithDb").collection("menus")
        const cartCollections = client.db("FoodAppWithDb").collection("cartItems")

        // All menu items
        app.get('/menus', async (req, res) => {
            console.log("jjgjhgjh")
            const result = await menuCollections.find().toArray()
            res.send(result)
        })
        app.post('/carts', async (req, res) => {
            const cartItem = req.body;
            const result = await cartCollections.insertOne(cartItem)
            res.send(result)
        })

        // get carts acc to email
        app.get("/carts", async (req, res) => {
            const email = req.query.email;
            const filter = { email: email };
            const result = await cartCollections.find(filter).toArray()
            res.send(result)
        })

        // Get specific cart
        app.get('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {
                _id: new Object(id)
            };
            const result = await cartCollections.deleteOne(filter)
            res.send(result)
        })
        // Delete item form cart

        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {
                _id: new Object(id)
            };
            const result = await cartCollections.deleteOne(filter)
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Hello World this is foodApp!");
});
// app.get('/menus', async (req, res) => {
//     const result = await menuCollections.find().toArray()
//     res.send(result)
// })
app.listen(PORT, () => {
    console.log(`App started on port: ${PORT}`)
})
