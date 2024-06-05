const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.SECRET_USER_NAME}:${process.env.SECRET_PASSWORD}@cluster0.luy9u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    //database
    const ElectroMartDB = client.db("ElectroMartDB");
    const productCollection = ElectroMartDB.collection("products");
    const userCollection = ElectroMartDB.collection("users");

    //* PRODUCT ROUTES CRUD START

    //Get Methods: for all products
    app.get("/products", async (req, res) => {
      const user = productCollection.find();
      const result = await user.toArray();
      res.send(result);
    });

    //Single product data load by id
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    //Post Method: for add product to DB
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    //Delete Method-> Delete single product
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    //Put-> Update Methods
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = {
        $set: {
          title: product.title,
          company: product.company,
          category: product.category,
          del_price: product.del_price,
          image: product.image,
          off_sale: product.off_sale,
          price: product.price,
          ratings: product.ratings,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updateProduct,
        options
      );
      res.send(result);
    });

    //* USER COLLECTION
    //! Save user information in userCollection after login
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const query = { email: user.email };
      const isUserExist = await userCollection.findOne(query);

      if (isUserExist) {
        return res.send({ message: "user already exist in database" });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    //!Get --> Read : (CRUD) (Default all get)
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged to Server Successfully");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("ElectroMart server running...");
});

app.listen(port, () => {
  console.log(`ElectroMart server running on port ${port}`);
});
