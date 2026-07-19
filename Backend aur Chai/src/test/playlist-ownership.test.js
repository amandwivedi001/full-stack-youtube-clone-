import { beforeEach, describe, expect, it, vi } from "vitest";
import { callController } from "./testUtils.js";

vi.mock("../models/playlist.model.js", () => ({
    Playlist: {
        findById: vi.fn(),
        findByIdAndUpdate: vi.fn(),
        findByIdAndDelete: vi.fn(),
    },
}));

import { Playlist } from "../models/playlist.model.js";
import {
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
} from "../controllers/playlist.controller.js";

describe("Playlist ownership", () => {
    const ownerId = "507f1f77bcf86cd799439011";
    const otherUserId = "507f1f77bcf86cd799439012";
    const playlistId = "507f1f77bcf86cd799439013";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("rejects playlist update by non-owner", async () => {
        Playlist.findById.mockResolvedValue({
            _id: playlistId,
            owner: ownerId,
        });

        const { error } = await callController(updatePlaylist, {
            params: { playlistId },
            body: {
                name: "Updated playlist",
                discription: "Updated description",
            },
            user: { _id: otherUserId },
        });

        expect(error.statusCode).toBe(403);
        expect(error.message).toBe("Not allowed to update this playlist");
        expect(Playlist.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it("rejects playlist delete by non-owner", async () => {
        Playlist.findById.mockResolvedValue({
            _id: playlistId,
            owner: ownerId,
        });

        const { error } = await callController(deletePlaylist, {
            params: { playlistId },
            user: { _id: otherUserId },
        });

        expect(error.statusCode).toBe(403);
        expect(error.message).toBe("Not allowed to delete this playlist");
        expect(Playlist.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it("rejects adding video to playlist by non-owner", async () => {
        const videoId = "507f1f77bcf86cd799439014";

        Playlist.findById.mockResolvedValue({
            _id: playlistId,
            owner: ownerId,
        });

        const { error } = await callController(addVideoToPlaylist, {
            params: { playlistId, videoId },
            user: { _id: otherUserId },
        });

        expect(error.statusCode).toBe(403);
        expect(error.message).toBe("Not allowed to modify this playlist");
        expect(Playlist.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it("rejects removing video from playlist by non-owner", async () => {
        const videoId = "507f1f77bcf86cd799439014";

        Playlist.findById.mockResolvedValue({
            _id: playlistId,
            owner: ownerId,
        });

        const { error } = await callController(removeVideoFromPlaylist, {
            params: { playlistId, videoId },
            user: { _id: otherUserId },
        });

        expect(error.statusCode).toBe(403);
        expect(error.message).toBe("Not allowed to modify this playlist");
        expect(Playlist.findByIdAndUpdate).not.toHaveBeenCalled();
    });
});