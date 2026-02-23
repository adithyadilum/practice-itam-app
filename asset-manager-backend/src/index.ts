import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { assets } from './db/schema';
import assetsRouter from './routes/assets';
import auditRouter from './routes/audit';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Demo Login Route to generate JWT token
app.post("/login", (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    const role = username === "admin" ? "Admin" : "Viewer";
    const secret = process.env.JWT_SECRET || "default_secret";

    const token = jwt.sign({ username, role }, secret, { expiresIn: "1h" });
    res.json({ token });
});

app.use("/assets", assetsRouter);
app.use("/audit", auditRouter);

app.get("/", (req, res) => {
    res.send("Asset Manager Backend is running");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

(async () => {
    try {
        const result = await db.select().from(assets);
        console.log("DB Connected. Assets:", result.length);
    } catch (error) {
        console.error("DB Connection Error:", error);
    }
})();
