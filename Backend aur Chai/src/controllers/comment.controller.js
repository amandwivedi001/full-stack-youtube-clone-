import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiRes } from "../utils/ApiRes.js"
import { asyncHandler } from "../utils/asyncHandler.js"
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Video ID is invalid");
    }

    const objectVideoId = new mongoose.Types.ObjectId(videoId);

    const comments = await Comment.aggregate([
        { $match: { video: objectVideoId } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNum },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                "owner._id": 1,
                "owner.username": 1,
                "owner.avatar": 1
            }
        }
    ]);

    return res.status(200).json(
        new ApiRes(200, comments, "All comments of video fetched successfully")
    );
});


const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, 'Video ID is invalid')
    }

    const { comment } = req.body

    if (!comment?.trim()) {
        throw new ApiError(400, 'Comment cannot be empty')
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, 'Video not found')
    }

    const userId = req.user?._id

    const AddedComment = await Comment.create({
        content: comment.trim(),
        video: videoId,
        owner: userId
    })

    return res
        .status(200)
        .json(
            new ApiRes(
                200,
                AddedComment,
                'Comment in a video added successfully'
            )
        )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const { commentId } = req.params

    const { comment } = req.body

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, 'Invalid Comment Id')
    }

    const commentExist = await Comment.findById(commentId);

    if (!commentExist) {
        throw new ApiError(404, 'Such comment does not exist to update');
    }

    if (commentExist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'You are not allowed to update this comment')
    }

    if (!comment?.trim()) {
        throw new ApiError(400, 'Comment cannot be empty')
    }

    await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content: comment.trim()
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(
            new ApiRes(
                200,
                'Comment updated Successfully'
            )
        )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const { commentId } = req.params

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, 'Invalid Comment Id')
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, 'Comment not found')
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'You are not allowed to delete this comment')
    }

    await Comment.findByIdAndDelete(commentId)

    return res
        .status(200)
        .json(
            new ApiRes(
                200,
                'Comment deleted Successfully'
            )
        )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
