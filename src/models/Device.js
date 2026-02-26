import mongoose from "mongoose";

const DeviceSchema = new mongoose.Schema({
  deviceId: String,
  serialNumber: String,
  assignedEmployee: String,
  publicIP: String,
  location: String,
  status: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
  },
  lastActive: Date,
  ipHistory: [
    {
      ip: String,
      location: String,
      timestamp: Date,
    },
  ],
}, { timestamps: true });

export default mongoose.models.Device ||
  mongoose.model("Device", DeviceSchema);