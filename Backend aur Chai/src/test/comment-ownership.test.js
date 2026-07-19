import { beforeEach, describe, expect, it, vi } from "vitest";
import { callController } from "./testUtils.js";

vi.mock("../models/comment.model.js", () => ({
    Comment: {
        findById: vi.fn(),
        findByIdAndUpdate: vi.fn(),
        findByIdAndDelete: vi.fn(),
    },
}));

vi.mock("../models/video.model.js", () => ({
    Video: {},
}));

import { Comment } from "../models/comment.model.js";
import {
    updateComment,
    deleteComment,
} from "../controllers/comment.controller.js";

describe("Comment ownership", () => {
    const ownerId = "507f1f77bcf86cd799439011";
    const otherUserId = "507f1f77bcf86cd799439012";
    const commentId = "507f1f77bcf86cd799439013";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("rejects comment update by non-owner", async () => {
        Comment.findById.mockResolvedValue({
            _id: commentId,
            owner: ownerId,
        });

        const { error } = await callController(updateComment, {
            params: { commentId },
            body: { comment: "Updated comment" },
            user: { _id: otherUserId },
        });

        expect(error.statusCode).toBe(403);
        expect(error.message).toBe("You are not allowed to update this comment");
        expect(Comment.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it("rejects comment delete by non-owner", async () => {
        Comment.findById.mockResolvedValue({
            _id: commentId,
            owner: ownerId,
        });

        const { error } = await callController(deleteComment, {
            params: { commentId },
            user: { _id: otherUserId },
        });

        expect(error.statusCode).toBe(403);
        expect(error.message).toBe("You are not allowed to delete this comment");
        expect(Comment.findByIdAndDelete).not.toHaveBeenCalled();
    });
});