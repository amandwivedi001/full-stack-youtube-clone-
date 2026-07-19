import mongoose , {Schema} from "mongoose"

const likeSchema = Schema(
    {
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        }
    }
    , {timestamps: true}
)

likeSchema.index(
    { video: 1, likedBy: 1 },
    {
        unique: true,
        partialFilterExpression: { video: { $exists: true } },
    }
);

likeSchema.index(
    { comment: 1, likedBy: 1 },
    {
        unique: true,
        partialFilterExpression: { comment: { $exists: true } },
    }
);

likeSchema.index(
    { tweet: 1, likedBy: 1 },
    {
        unique: true,
        partialFilterExpression: { tweet: { $exists: true } },
    }
);

likeSchema.index({ likedBy: 1, createdAt: -1 });

export const Like = mongoose.model("Like", likeSchema)