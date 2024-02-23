const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
  message: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, default: new Date() },
});

module.exports = mongoose.model('Comment', CommentSchema);
