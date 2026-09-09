const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5501",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.put("/api/tasks/:id", async (req, res) => {
    try {
        const itemId = req.params.id;
        const { item_name, item_description } = req.body;
        const [result] = await db.execute(
            `UPDATE items
             SET item_name = ?, item_description = ?
             WHERE item_id = ?`,
            [item_name, item_description, itemId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "Task not found"
            });
        }
        res.json({
            status: 200,
            message: "Item updated"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: 500,
            message: "Server error"
        });
    }
});

app.listen(3000, () => {
    console.log("API running on http://localhost:3000");
});