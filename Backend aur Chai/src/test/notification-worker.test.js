import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/subscription.model.js", () => ({
    Subscription: {
        find: vi.fn(),
    },
}));

vi.mock("../models/notification.model.js", () => ({
    Notification: {
        insertMany: vi.fn(),
    },
}));

import { Subscription } from "../models/subscription.model.js";
import { Notification } from "../models/notification.model.js";
import { processVideoPublished } from "../workers/processors/videoPublished.processor.js";

describe("Notification worker behavior", () => {
    const videoId = "507f1f77bcf86cd799439011";
    const ownerId = "507f1f77bcf86cd799439012";
    const subscriberOne = "507f1f77bcf86cd799439013";
    const subscriberTwo = "507f1f77bcf86cd799439014";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("creates notifications for all channel subscribers", async () => {
        Subscription.find.mockReturnValue({
            select: vi.fn().mockResolvedValue([
                { subscriber: subscriberOne },
                { subscriber: subscriberTwo },
            ]),
        });

        const result = await processVideoPublished({
            data: {
                videoId,
                ownerId,
                title: "BullMQ Test Video",
            },
        });

        expect(Subscription.find).toHaveBeenCalledWith({
            channel: ownerId,
        });

        expect(Notification.insertMany).toHaveBeenCalledWith(
            [
                {
                    recipient: subscriberOne,
                    sender: ownerId,
                    video: videoId,
                    type: "video_published",
                    message: "New video published: BullMQ Test Video",
                },
                {
                    recipient: subscriberTwo,
                    sender: ownerId,
                    video: videoId,
                    type: "video_published",
                    message: "New video published: BullMQ Test Video",
                },
            ],
            { ordered: false }
        );

        expect(result).toEqual({
            processed: true,
            notificationsCreated: 2,
            videoId,
        });
    });

    it("does not create notifications when channel has no subscribers", async () => {
        Subscription.find.mockReturnValue({
            select: vi.fn().mockResolvedValue([]),
        });

        const result = await processVideoPublished({
            data: {
                videoId,
                ownerId,
                title: "No Subscribers Video",
            },
        });

        expect(Notification.insertMany).not.toHaveBeenCalled();

        expect(result).toEqual({
            processed: true,
            notificationsCreated: 0,
            videoId,
        });
    });
});