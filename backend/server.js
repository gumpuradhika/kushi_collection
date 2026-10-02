const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
const PORT = 5000;

// Allow Express to read JSON data
app.use(express.json());

// MongoDB connection
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);

let db;
async function connectToMongoDB() {
    try {
        await client.connect();

        console.log("Connected to MongoDB successfully!");

        db = client.db("kushiCollection");

    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

// Test route
app.get("/", (req, res) => {
    res.send("Kushi Collection Store Backend is Working!");
});
// Create a new order
app.post("/api/orders", async (req, res) => {
    try {
        const order = req.body;
        order.status = "Pending";

        const result = await db
            .collection("orders")
            .insertOne(order);

        res.status(201).json({
            message: "Order saved successfully!",
            orderId: result.insertedId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to save order" + error.message
        });
    }
});
// Get all orders
app.get("/api/orders", async (req, res) => {
    try {
        const orders = await db
    .collection("orders")
    .find({})
    .sort({ _id: -1 })
    .toArray();

        res.json(orders);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get orders"
        });
    }
});
// Update order status
app.put("/api/orders/:id", async (req, res) => {
    try {
        const { ObjectId } = require("mongodb");

        const result = await db
            .collection("orders")
            .updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: { status: req.body.status } }
            );

        res.json({
            message: "Order status updated successfully!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update order status"
        });
    }
});
app.delete("/api/orders/:id", async (req, res) => {
    try {
        const { ObjectId } = require("mongodb");

        await db.collection("orders").deleteOne({
            _id: new ObjectId(req.params.id)
        });

        res.json({
            message: "Order deleted successfully!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete order"
        });
    }
});

// Start server
async function startServer() {
    await connectToMongoDB();

    app.listen(process.env.PORT || PORT, () => {
        console.log(`Server is running on port ${process.env.PORT || PORT}`);
    });
}

startServer();