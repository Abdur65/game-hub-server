const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;

app.use(cors());
// parsing to json 
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vqr8hsb.mongodb.net/?retryWrites=true&w=majority`;
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
    // CRUD ops
    const gameCollection = client.db("game-service").collection("games")

    // API for creating a new game post.
    app.post('/add-a-game', async(req, res) =>{
        const game = req.body;
        //Insert to MongoDB
        const result = await gameCollection.insertOne(game)
        
        console.log.apply(req.body);
        res.send(result);
    });

    // API for fetching all games

    app.get("/all-games", async(req, res) => {
      const result = await gameCollection.find().toArray()
      res.send(result);
    })
    //API for fetching single details
    app.get("/game/:id", async(req, res) =>{
      const id = req.params.id;
      //console.log(id);
      //find a game using id passed as param
      const result = await gameCollection.findOne({_id: new ObjectId(id)});

      res.send(result);
    })

  } finally {

    
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
