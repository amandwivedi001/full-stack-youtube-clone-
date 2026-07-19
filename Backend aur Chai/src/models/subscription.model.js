import mongoose, { Schema } from "mongoose"

const subscriptionsSchema = Schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId, // one who is subscribing
            ref: "User"
        },
        channel: {
            type: Schema.Types.ObjectId, //one whom suscribers are suscribing
            ref: "User"
        }
    },
    { timestamps: true }
)

subscriptionsSchema.index(
    { subscriber: 1, channel: 1 },
    { unique: true }
);

subscriptionsSchema.index({ channel: 1, createdAt: -1 });
subscriptionsSchema.index({ subscriber: 1, createdAt: -1 });


export const Subscription = mongoose.model("Subscription", subscriptionsSchema);
