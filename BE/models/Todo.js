const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const validCategories = ["Work", "Home", "Personal", "Urgent"];
const validStatuses = ["Pending", "Completed"];

const todoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    category: { type: String, enum: validCategories, default: "Work" },
    status: { type: String, enum: validStatuses, default: "Pending" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: Number },
    dueDate: { type: Date, required: true },
    comments: [
      { text: { type: String }, createdAt: { type: Date, default: Date.now } },
    ],
  },
  { timestamps: true }
);

todoSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Todo", todoSchema);
