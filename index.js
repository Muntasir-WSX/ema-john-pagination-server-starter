const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@simple-crud-server.a0arf8b.mongodb.net/?appName=simple-crud-server`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('emaJohnDB').collection('products');


    // page e data vag kora
    app.get('/products', async(req, res) => {
      try {
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 10;
        console.log("pagination query", page, size);
        const result = await productCollection.find().skip(page * size).limit(size).toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send({ error: 'Failed to fetch products' });
      }
    })

    app.post ('/productByIds', async (req,res ) => {
      const ids = req.body;
      res.send([]);
    })
    app.get('/productsCount', async (req, res) => {
      try {
        const count = await productCollection.estimatedDocumentCount();
        res.send({ count });
      } catch (error) {
        console.error('Error fetching product count:', error);
        res.status(500).send({ error: 'Failed to fetch product count' });
      }
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.get('/', (req, res) =>{
        res.send('john is busy shopping')
    })

    app.listen(port, () =>{
        console.log(`ema john server is running on port: ${port}`);
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
