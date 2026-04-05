const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    licenseNumber: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true },
    ambulanceNumber: { type: String, required: true, unique: true, trim: true },
    ambulanceType: {
      type: String,
      required: true,
      enum: ["Basic Life Support", "Advanced Life Support", "Non Emergency"],
    },
    password: { type: String, required: true },
    availabilityStatus: {
      type: String,
      enum: ["Available", "Offline"],
      default: "Offline",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
