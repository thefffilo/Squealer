const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  vip: {
    type: Boolean,
    default: false,
  },
  conversations: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Conversation",
    },
  ],
  subscribedChannel: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Channel",
    },
  ],
  refreshToken: { type: String },
});

module.exports = mongoose.model("User", userSchema);
