import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import { db } from './db';
import { assets } from './db/schema';
import assetsRouter from './routes/assets';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/assets", assetsRouter);

app.get("/", (req, res) => {
    res.send("Asset Manager Backend is running");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

(async () => {
    const result = await db.select().from(assets);
    console.log("DB Connected. Assets:", result);
})();
