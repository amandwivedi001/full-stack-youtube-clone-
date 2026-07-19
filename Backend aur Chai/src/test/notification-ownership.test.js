import { beforeEach, describe, expect, it, vi } from "vitest";
import { callController } from "./testUtils.js";

vi.mock("../models/notification.model.js", () => ({
    Notification: {
        findOneAndUpdate: vi.fn(),
        updateMany: vi.fn(),
        find: vi.fn(),
        countDocuments: vi.fn(),
    },
}));

import { Notification } from "../models/notification.model.js";
import {
    markNotificationRead,
    markAllNotificationsRead,
} from "../controllers/notification.controller.js";

describe("Notification ownership", () => {
    const userId = "507f1f77bcf86cd799439011";
    const otherUserId = "507f1f77bcf86cd799439012";
    const notificationId = "507f1f77bcf86cd799439013";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("marks notification read only when it belongs to current user", async () => {
        Notification.findOneAndUpdate.mockResolvedValue({
            _id: notificationId,
            recipient: userId,
            isRead: true,
        });

        const { body, error } = await callController(markNotificationRead, {
            params: { notificationId },
            user: { _id: userId },
        });

        expect(error).toBeUndefined();

        expect(Notification.findOneAndUpdate).toHaveBeenCalledWith(
            {
                _id: notificationId,
                recipient: userId,
            },
            {
                $set: { isRead: true },
            },
            {
                new: true,
            }
        );

        expect(body.success).toBe(true);
    });

    it("returns 404 when user tries to mark another user's notification", async () => {
        Notification.findOneAndUpdate.mockResolvedValue(null);

        const { error } = await callController(markNotificationRead, {
            params: { notificationId },
            user: { _id: otherUserId },
        });

        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("Notification not found");
    });

    it("marks all notifications read only for current user", async () => {
        Notification.updateMany.mockResolvedValue({
            modifiedCount: 3,
        });

        const { body, error } = await callController(markAllNotificationsRead, {
            user: { _id: userId },
        });

        expect(error).toBeUndefined();

        expect(Notification.updateMany).toHaveBeenCalledWith(
            {
                recipient: userId,
                isRead: false,
            },
            {
                $set: { isRead: true },
            }
        );

        expect(body.success).toBe(true);
    });
});