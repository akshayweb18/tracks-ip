import mongoose from "mongoose";

const DeviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, "deviceId is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    assignedEmployee: {
      type: String,
      required: [true, "assignedEmployee is required"],
      trim: true,
    },
    publicIP: String,
    localIP: String,
    location: String,
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    systemInfo: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.models.Device ||
  mongoose.model("Device", DeviceSchema);