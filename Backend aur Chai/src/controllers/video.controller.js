import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiRes } from "../utils/ApiRes.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const pipeline = []

    const givenquery = {}

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    if (query) {
        givenquery.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    }

    if (mongoose.isValidObjectId(userId)) {
        givenquery.owner = new mongoose.Types.ObjectId(userId);
    }

    pipeline.push({ $match: givenquery })

    const sort = {}

    const allowedSortFields = ["createdAt", "views", "likeCount", "duration", "title"];

    if (sortBy && allowedSortFields.includes(sortBy)) {
        sort[sortBy] = sortType === "asc" ? 1 : -1;
    } else {
        sort.createdAt = -1;
    }

    pipeline.push({ $sort: sort })

    pipeline.push({ $skip: skip }, { $limit: limitNum })

    pipeline.push(
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner'
            }
        }
    )

    pipeline.push({
        $project: {
            title: 1,
            thumbnail: 1,
            views: 1,
            likes: 1,
            duration: 1,
            createdAt: 1,

            "owner._id": 1,
            "owner.username": 1,
            "owner.avatar": 1,
            "owner.coverImage": 1
        }
    });

    const data = await Video.aggregate(pipeline)

    return res
        .status(200)
        .json(
            new ApiRes(
                200,
                data,
                'Video fetched successfully'
            )
        )
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video
    // taking video and thumbnail from frontend 
    // upload it on cloudnary
    // taking url of video and thumbnail and at last duration
    // create video object
    // sent res

    const userId = req.user._id;
    const videoLocalPath = req.files?.videoFile?.[0]?.path

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file required")
    }

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file required")
    }

    const videoRes = await uploadOnCloudinary(videoLocalPath)
    const thumbRes = await uploadOnCloudinary(thumbnailLocalPath)


    if (!videoRes || !thumbRes) {
        throw new ApiError(400, 'Uploading on cloudnary failed')
    }

    const videoUrl = videoRes.secure_url || videoRes.url;
    const duration = typeof videoRes.duration === "number" ? videoRes.duration : Number(videoRes.duration || 0);
    const thumbnailUrl = thumbRes.secure_url || thumbRes.url;

    const videoFile = await Video.create({
        videoFile: videoUrl,
        thumbnail: thumbnailUrl,
        title: title,
        description: description,
        duration: duration,
        owner: userId,
    })

    return res
        .status(200)
        .json(
            new ApiRes(
                200,
                videoFile,
                'Video Uploaded Successfully'
            )
        )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, 'Enter valid video id')
    }

    const viewKey = `viewed_${videoId}`;

    if (!req.cookies[viewKey]) {
        await Video.findByIdAndUpdate(
            videoId,
            { $inc: { views: +1 } }
        )

        const isProd = process.env.NODE_ENV === "production";

        res.cookie(viewKey, true, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: isProd ? "none" : "lax",
            secure: isProd
        });
    }

    const [video] = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            avatar: 1,
                            coverImage: 1,
                        },
                    },
                ],
            },
        },
        {
            $set: {
                owner: { $first: "$owner" },
            },
        },
    ]);



    if (video == null) {
        throw new ApiError(404, 'Video not found')
    }

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                watchHistory: {
                    video: videoId
                }
            }
        }
    );

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $push: {
                watchHistory: {
                    video: videoId,
                    watchedAt: new Date()
                }
            }
        }
    );
    return res
        .status(200)
        .json(
            new ApiRes(
                200,
                video,
                'Video fetched successfully'
            )
        )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Enter valid video id");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this video");
    }

    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    const thumbnailLocalPath = req.file?.path;

    if (thumbnailLocalPath) {
        const thumbRes = await uploadOnCloudinary(thumbnailLocalPath);

        if (!thumbRes) {
            throw new ApiError(400, "Thumbnail upload failed");
        }

        updateData.thumbnail = thumbRes.secure_url || thumbRes.url;
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    return res.status(200).json(
        new ApiRes(200, updatedVideo, "Video updated successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video ID')
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, 'Video not found')
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'You are not allowed to delete this video')
    }

    await Video.findByIdAndDelete(videoId)

    return res
        .status(200)
        .json(
            new ApiRes(
                200,
                'Video deleted successfully'
            )
        )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video ID')
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, 'Video not found')
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'You are not allowed to update this video')
    }

    video.isPublished = !video.isPublished
    await video.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiRes(
                200,
                video.isPublished,
                'Video toggle Successfully'
            )
        )
})

const getRecommendedVideos = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { limit = 8 } = req.query;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const currentVideo = await Video.findById(videoId).lean();

    if (!currentVideo) {
        throw new ApiError(404, "Video not found");
    }

    const limitNum = Math.min(20, Math.max(1, parseInt(limit, 10) || 8));

    const keywords = [
        ...(currentVideo.title || "").split(" "),
        ...(currentVideo.description || "").split(" "),
    ]
        .map((word) => word.trim())
        .filter((word) => word.length > 3)
        .slice(0, 8);

    const regexQuery = keywords.length
        ? {
            $or: [
                { title: { $regex: keywords.join("|"), $options: "i" } },
                { description: { $regex: keywords.join("|"), $options: "i" } },
            ],
        }
        : {};

    const videos = await Video.aggregate([
        {
            $match: {
                _id: { $ne: new mongoose.Types.ObjectId(videoId) },
                isPublished: true,
                $or: [
                    { owner: currentVideo.owner },
                    regexQuery.$or ? regexQuery : { views: { $gte: 0 } },
                ],
            },
        },
        {
            $addFields: {
                score: {
                    $add: [
                        { $cond: [{ $eq: ["$owner", currentVideo.owner] }, 20, 0] },
                        { $multiply: [{ $ifNull: ["$views", 0] }, 0.2] },
                        { $multiply: [{ $ifNull: ["$likeCount", 0] }, 2] },
                    ],
                },
            },
        },
        { $sort: { score: -1, createdAt: -1 } },
        { $limit: limitNum },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $project: {
                title: 1,
                thumbnail: 1,
                views: 1,
                duration: 1,
                createdAt: 1,
                likeCount: 1,
                "owner._id": 1,
                "owner.username": 1,
                "owner.fullname": 1,
                "owner.avatar": 1,
            },
        },
    ]);

    return res.status(200).json(
        new ApiRes(200, videos, "Recommended videos fetched successfully")
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getRecommendedVideos
}
