import { Router } from "express";
import { db } from "../db";
import { assets } from "../db/schema";
import { eq, and, ilike, gte, lte, SQL } from "drizzle-orm";
import { logAuditEvent } from "../services/audit";

const router = Router();

// Advanced Search API
router.get("/search", async (req, res) => {
  try {
    const { name, category, minQty, maxQty, serialNumber, assetTag } = req.query;

    const filters: SQL[] = [];

    if (name) {
      filters.push(ilike(assets.name, `%${name}%`));
    }
    if (category) {
      filters.push(eq(assets.category, category as string));
    }
    if (minQty) {
      filters.push(gte(assets.quantity, Number(minQty)));
    }
    if (maxQty) {
      filters.push(lte(assets.quantity, Number(maxQty)));
    }
    if (serialNumber) {
      filters.push(eq(assets.serialNumber, serialNumber as string));
    }
    if (assetTag) {
      filters.push(eq(assets.assetTag, assetTag as string));
    }

    const results = await db
      .select()
      .from(assets)
      .where(filters.length > 0 ? and(...filters) : undefined);

    res.json(results);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ error: "Advanced search failed" });
  }
});

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
    const { name, category, quantity, serialNumber, assetTag } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const [inserted] = await db
      .insert(assets)
      .values({
        name,
        category: category ?? null,
        quantity: quantity ?? 1,
        serialNumber: serialNumber ?? null,
        assetTag: assetTag ?? null,
      })
      .returning();

    if (!inserted) {
      return res.status(500).json({ error: "Failed to create asset" });
    }

    await logAuditEvent(inserted.id, "create", inserted);
    res.status(201).json(inserted);
  } catch (error) {
    console.error("Error creating asset:", error);
    res.status(500).json({ error: "Failed to create asset" });
  }
});

// Get asset by ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid asset ID" });
    }

    const [row] = await db.select().from(assets).where(eq(assets.id, id));

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

    const { name, category, quantity, serialNumber, assetTag } = req.body;

    // Check if asset exists
    const [existing] = await db
      .select()
      .from(assets)
      .where(eq(assets.id, id));

    if (!existing) {
      return res.status(404).json({ error: "Asset not found" });
    }

    // Update only provided fields
    const [updated] = await db
      .update(assets)
      .set({
        name: name ?? existing.name,
        category: category ?? existing.category,
        quantity: quantity ?? existing.quantity,
        serialNumber: serialNumber ?? existing.serialNumber,
        assetTag: assetTag ?? existing.assetTag,
      })
      .where(eq(assets.id, id))
      .returning();

    if (!updated) {
      return res.status(500).json({ error: "Failed to update asset" });
    }

    await logAuditEvent(id, "update", { before: existing, after: updated });
    res.json(updated);
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
    await logAuditEvent(id, "delete", existing);
    res.json({ message: "Asset deleted successfully" });
  } catch (err) {
    console.error("Error deleting asset:", err);
    res.status(500).json({ error: "Failed to delete asset" });
  }
});

export default router;