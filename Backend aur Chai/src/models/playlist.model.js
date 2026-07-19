import mongoose, { Schema, SchemaTypes } from "mongoose"

const playlistSchema = Schema(
    {
        name: {
            type: String,
            required: true
        },
        discription: {
            type: String,
            required: true
        },
        video: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
)

playlistSchema.index({ owner: 1, createdAt: -1 });

playlistSchema.index(
    { owner: 1, name: 1 },
    { unique: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema)