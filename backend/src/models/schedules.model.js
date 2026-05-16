import mongoose, { Schema } from "mongoose";

const scheduleSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        room: {
            type: String,
            required: true,
            trim: true,
        },
        time: {
            type: String,
            required: true,
            trim: true,
        },
        day: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["lab", "lecture"],
            default: "lecture",
            trim: true,
            lowercase: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Schedule = mongoose.model("Schedule", scheduleSchema);
