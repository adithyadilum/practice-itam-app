import { db } from "../db";
import { auditLogs } from "../db/schema";

export type AuditAction = "create" | "update" | "delete";

export const logAuditEvent = async (
    assetId: number,
    action: AuditAction,
    payload: Record<string, unknown>
) => {
    await db.insert(auditLogs).values({
        assetId,
        action,
        payload,
    });
};
