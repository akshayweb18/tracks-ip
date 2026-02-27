import mongoose from "mongoose";

const DeviceSchema = new mongoose.Schema(
  {
    deviceId: String,
    assignedEmployee: String,
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
  },
  { timestamps: true }
);

export default mongoose.models.Device ||
  mongoose.model("Device", DeviceSchema);