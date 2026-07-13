import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
    },

    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    fileTree: {
      type: Object,
      default: {},
    },
messages: [
  {
    senderId: {
      type: String,
      required: true,
    },
    senderEmail: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("project", projectSchema);

export default Project;