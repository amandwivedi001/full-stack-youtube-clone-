import mongoose , {Schema} from "mongoose"

const tweetSchema = Schema(
    {
        owner: {
            type : Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            required: true
        }
    },
     {timestamps: true}
    )

tweetSchema.index({ owner: 1, createdAt: -1 });
tweetSchema.index({ content: "text" });

export const Tweet = mongoose.model("Tweet", tweetSchema)