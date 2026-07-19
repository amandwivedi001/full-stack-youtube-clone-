import { Subscription } from "../../models/subscription.model.js";
import { Notification } from "../../models/notification.model.js";

export const processVideoPublished = async (job) => {
    const { videoId, ownerId, title } = job.data;

    const subscriptions = await Subscription.find({
        channel: ownerId,
    }).select("subscriber");

    if (subscriptions.length === 0) {
        return {
            processed: true,
            notificationsCreated: 0,
            videoId,
        };
    }

    const notifications = subscriptions.map((sub) => ({
        recipient: sub.subscriber,
        sender: ownerId,
        video: videoId,
        type: "video_published",
        message: `New video published: ${title}`,
    }));

    await Notification.insertMany(notifications, { ordered: false });

    return {
        processed: true,
        notificationsCreated: notifications.length,
        videoId,
    };
};