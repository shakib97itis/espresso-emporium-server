const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://devshakib97:D.mongo.1@cluster0.bpwlndv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffee");

    // Get all the coffee
    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get a specific coffee
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    // Create a coffee
    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // Update a coffee
    app.put("/coffee", async (req, res) => {
      const { id, name, chef, supplier, category, details, photo } = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: name,
          chef: chef,
          supplier: supplier,
          category: category,
          details: details,
          photo: photo,
        },
      };

      const result = await coffeeCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    //   delete a document
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(filter);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffee making server is running");
});

app.listen(port, () => {
  console.log(`Coffee Server is running on port: ${port}`);
});

// app.get("/coffee/:id", async (req, res) => {
//   const id = req.params.id;
//   const query = { _id: new ObjectId(id) };
//   const result = await coffeeCollection.findOne(query);
//   res.send(result);
// });

// app.delete("/coffee/:id", async (req, res) => {
//   const id = req.params.id;
//   const query = { _id: new ObjectId(id) };
//   const result = await coffeeCollection.deleteOne(query);
//   res.send(result);
// });

// app.put("/coffee/:id", async (req, res) => {
//   const id = req.params.id;
//   const filter = { _id: new ObjectId(id) };
//   const options = { upsert: true };
//   const updatedCoffee = req.body;

//   const coffee = {
//     $set: {
//       name: updatedCoffee.name,
//       chef: updatedCoffee.chef,
//       supplier: updatedCoffee.supplier,
//       taste: updatedCoffee.taste,
//       category: updatedCoffee.category,
//       details: updatedCoffee.details,
//       photo: updatedCoffee.photo,
//     },
//   };

//   const result = await coffeeCollection.updateOne(filter, coffee, options);
//   res.send(result);
// });
