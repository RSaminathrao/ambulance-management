const AmbulanceRequest = require("../models/AmbulanceRequest");
const Driver = require("../models/Driver");
const Trip = require("../models/Trip");
const { EARNING_MAP } = require("./driverController");

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@ambulance.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: "Invalid admin credentials." });
  }

  return res.status(200).json({
    message: "Admin login successful.",
    admin: { email: adminEmail },
  });
};

const assignDriver = async (req, res) => {
  try {
    const { requestId, driverId } = req.body;

    if (!requestId || !driverId) {
      return res.status(400).json({ message: "requestId and driverId are required." });
    }

    const request = await AmbulanceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }
    if (request.status === "Assigned" || request.status === "Completed") {
      return res.status(400).json({ message: "Request already assigned/completed." });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found." });
    }

    if (driver.availabilityStatus !== "Available") {
      return res.status(400).json({ message: "Driver is not available." });
    }

    if (driver.ambulanceType !== request.injuryType) {
      return res.status(400).json({
        message: "Driver ambulance type does not match requested injury type.",
      });
    }

    request.assignedDriver = driver._id;
    request.status = "Assigned";
    await request.save();

    driver.availabilityStatus = "Offline";
    await driver.save();

    await Trip.create({
      driverId: driver._id,
      date: new Date(),
      ambulanceType: request.injuryType,
      earnings: EARNING_MAP[request.injuryType] || 0,
      requestId: request._id,
    });

    return res.status(200).json({ message: "Driver assigned successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  loginAdmin,
  assignDriver,
};
