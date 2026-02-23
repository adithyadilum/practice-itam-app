import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { assets } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export const generateAssetId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { category, assetTag } = req.body;

        // If an asset tag is already provided, skip auto-generation
        if (assetTag) {
            return next();
        }

        // Determine category prefix, default to 'GEN'
        const prefix = category ? category.substring(0, 3).toUpperCase() : "GEN";

        // Find the latest asset tag with this prefix to determine the next number
        const latestAsset = await db
            .select({ assetTag: assets.assetTag })
            .from(assets)
            .where(eq(assets.category, category || null))
            .orderBy(desc(assets.id))
            .limit(1);

        let nextNumber = 1;
        if (latestAsset.length > 0) {
            const rawTag = latestAsset[0]?.assetTag;
            if (rawTag) {
                const match = rawTag.match(/\d+$/);
                if (match) {
                    nextNumber = parseInt(match[0], 10) + 1;
                }
            }
        }

        // Generate the new asset tag, e.g., LAP-001
        const newAssetTag = `${prefix}-${nextNumber.toString().padStart(3, "0")}`;

        // Attach the generated tag to the request body
        req.body.assetTag = newAssetTag;

        next();
    } catch (error) {
        console.error("Error generating asset ID:", error);
        res.status(500).json({ error: "Failed to generate asset ID" });
    }
};
