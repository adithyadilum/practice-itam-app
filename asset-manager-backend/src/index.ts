import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import { db } from './db';
import { assets } from './db/schema';
import assetsRouter from './routes/assets';
import auditRouter from './routes/audit';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
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
