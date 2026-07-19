import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
  videoFile: {        // cloudinary URL for the video
    type: String,
    required: true
  },
  thumbnail: {        // cloudinary URL for the thumbnail
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {      // fixed spelling
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  likeCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

videoSchema.index({ owner: 1, createdAt: -1 });
videoSchema.index({ isPublished: 1, createdAt: -1 });
videoSchema.index({ views: -1 });
videoSchema.index({ likeCount: -1 });
videoSchema.index({ title: "text", description: "text" });

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
