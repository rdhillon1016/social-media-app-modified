const mongoose = require("mongoose");

const { Schema } = mongoose;

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true, default: Date.now() },
  message: { type: String, required: true },
  /**
   * For now, users are only allowed to add predefined images to their posts
   * 0: no image
   * 1: 
   * 2:
   * 3:
   * 4:
   * 5:
   * 6: all three images
   */
  images: { type: Number, required: true, default: 0, min: 0, max: 6 },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

module.exports = mongoose.model("Post", PostSchema);
