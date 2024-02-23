const mongoose = require("mongoose");

const { Schema } = mongoose;

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true, default: new Date() },
  message: { type: String, required: true },
  /**
   * For now, users are only allowed to add three predefined images to their posts
   * 0: no image
   * 1: first image
   * 2: second image
   * 3: third image
   * 4: first and scond
   * 5: first and third
   * 6: second and third
   * 7: all three images
   */
  images: { type: Number, required: true, default: 0, min: 0, max: 7 },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

module.exports = mongoose.model("Post", PostSchema);
