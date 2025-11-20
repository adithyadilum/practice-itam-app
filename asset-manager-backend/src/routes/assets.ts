import { Router } from "express";
import { db } from "../db";
import { assets } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const allAssets = await db.select().from(assets);
        res.json(allAssets);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch assets" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { name, category, quantity } = req.body;
        if (!name) return res.status(400).json({ error: "Name is required" });

        const inserted = await db
            .insert(assets)
            .values({ name, category: category ?? null, quantity: quantity ?? 1 })
            .returning();
        res.status(201).json(inserted[0]);
    } catch (error) {
        console.error("Error creating asset:", error);
        res.status(500).json({ error: "Failed to create asset" });
    }
});

//Get asset by ID
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid asset ID" });
        }

        const [row] = await db
            .select()
            .from(assets)
            .where(eq(assets.id, id));

        if (!row) {
            return res.status(404).json({ error: "Asset not found" });
        }
        res.json(row);
    } catch (error) {
        console.error("Error fetching asset:", error);
        res.status(500).json({ error: "Failed to fetch asset" });
    }
});

// PUT /assets/:id
router.put("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        const { name, category, quantity } = req.body;

        // Check if asset exists
        const [existing] = await db
            .select()
            .from(assets)
            .where(eq(assets.id, id));

        if (!existing) {
            return res.status(404).json({ error: "Asset not found" });
        }

        // Update only provided fields
        const updated = await db
            .update(assets)
            .set({
                name: name ?? existing.name,
                category: category ?? existing.category,
                quantity: quantity ?? existing.quantity,
            })
            .where(eq(assets.id, id))
            .returning();

        res.json(updated[0]);
    } catch (err) {
        console.error("Error updating asset:", err);
        res.status(500).json({ error: "Failed to update asset" });
    }
});

// DELETE /assets/:id
router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        //check if asset exists
        const [existing] = await db
            .select()
            .from(assets)
            .where(eq(assets.id, id));

        if (!existing) {
            return res.status(404).json({ error: "Asset not found" });
        }

        await db.delete(assets).where(eq(assets.id, id));
        res.json({ message: "Asset deleted successfully" });
    } catch (err) {
        console.error("Error deleting asset:", err);
        res.status(500).json({ error: "Failed to delete asset" });
    }
});

export default router;