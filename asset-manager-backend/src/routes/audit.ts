import { Router } from "express";
import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import { assets, auditLogs } from "../db/schema";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const assetIdParam = req.query.assetId;
        const limitParam = req.query.limit;

        const assetId =
            typeof assetIdParam === "string" && assetIdParam.trim().length
                ? Number(assetIdParam)
                : undefined;

        if (assetIdParam && (assetId === undefined || Number.isNaN(assetId))) {
            return res.status(400).json({ error: "assetId must be a number" });
        }

        const limitValue =
            typeof limitParam === "string" && limitParam.trim().length
                ? Number(limitParam)
                : undefined;

        const pageSize = (() => {
            if (!limitValue || Number.isNaN(limitValue)) return 50;
            return Math.min(Math.max(limitValue, 1), 200);
        })();

        const baseQuery = db
            .select({
                id: auditLogs.id,
                assetId: auditLogs.assetId,
                assetName: assets.name,
                action: auditLogs.action,
                payload: auditLogs.payload,
                createdAt: auditLogs.createdAt,
            })
            .from(auditLogs)
            .leftJoin(assets, eq(auditLogs.assetId, assets.id));

        const rows = assetId !== undefined
            ? await baseQuery.where(eq(auditLogs.assetId, assetId)).orderBy(desc(auditLogs.createdAt)).limit(pageSize)
            : await baseQuery.orderBy(desc(auditLogs.createdAt)).limit(pageSize);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        res.status(500).json({ error: "Failed to fetch audit logs" });
    }
});

export default router;
