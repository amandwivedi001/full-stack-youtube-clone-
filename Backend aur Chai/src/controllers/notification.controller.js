import mongoose from "mongoose";
import { Notification } from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiRes } from "../utils/ApiRes.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getNotifications = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const notifications = await Notification.find({
        recipient: userId,
    })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("sender", "username fullname avatar")
        .populate("video", "title thumbnail")
        .lean();

    const unreadCount = await Notification.countDocuments({
        recipient: userId,
        isRead: false,
    });

    return res.status(200).json(
        new ApiRes(
            200,
            {
                notifications,
                unreadCount,
            },
            "Notifications fetched successfully"
        )
    );
});

const markNotificationRead = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    if (!mongoose.isValidObjectId(notificationId)) {
        throw new ApiError(400, "Invalid notification id");
    }

    const notification = await Notification.findOneAndUpdate(
        {
            _id: notificationId,
            recipient: req.user._id,
        },
        {
            $set: {
                isRead: true,
            },
        },
        { new: true }
    );

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    return res.status(200).json(
        new ApiRes(200, notification, "Notification marked as read")
    );
});

const markAllNotificationsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        {
            recipient: req.user._id,
            isRead: false,
        },
        {
            $set: {
                isRead: true,
            },
        }
    );

    return res.status(200).json(
        new ApiRes(200, null, "All notifications marked as read")
    );
});

export {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
};