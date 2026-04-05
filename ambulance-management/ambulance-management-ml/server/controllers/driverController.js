const bcrypt = require("bcryptjs");

const Driver = require("../models/Driver");
const AmbulanceRequest = require("../models/AmbulanceRequest");
const Trip = require("../models/Trip");

const EARNING_MAP = {
  "Basic Life Support": 500,
  "Advanced Life Support": 1000,
  "Non Emergency": 200,
};

const registerDriver = async (req, res) => {
  try {
    const {
      name,
      licenseNumber,
      phone,
      ambulanceNumber,
      ambulanceType,
      password,
    } = req.body;

    if (
      !name ||
      !licenseNumber ||
      !phone ||
      !ambulanceNumber ||
      !ambulanceType ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingDriver = await Driver.findOne({
      $or: [{ licenseNumber }, { ambulanceNumber }],
    });
    if (existingDriver) {
      return res.status(400).json({
        message: "Driver with this license or ambulance number already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const driver = await Driver.create({
      name,
      licenseNumber,
      phone,
      ambulanceNumber,
      ambulanceType,
      password: hashedPassword,
      availabilityStatus: "Offline",
    });

    return res
      .status(201)
      .json({ message: "Driver registered successfully.", driverId: driver._id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginDriver = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password are required." });
    }

    const driver = await Driver.findOne({ phone });
    if (!driver) {
      return res.status(404).json({ message: "Driver not found." });
    }

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    return res.status(200).json({
      message: "Driver login successful.",
      driver: {
        _id: driver._id,
        name: driver.name,
        phone: driver.phone,
        ambulanceNumber: driver.ambulanceNumber,
        ambulanceType: driver.ambulanceType,
        availabilityStatus: driver.availabilityStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const { driverId, availabilityStatus } = req.body;

    if (!driverId || !availabilityStatus) {
      return res
        .status(400)
        .json({ message: "driverId and availabilityStatus are required." });
    }

    if (!["Available", "Offline"].includes(availabilityStatus)) {
      return res.status(400).json({ message: "Invalid availability status." });
    }

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { availabilityStatus },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found." });
    }

    return res.status(200).json({
      message: "Availability updated.",
      availabilityStatus: driver.availabilityStatus,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAssignedRequests = async (req, res) => {
  try {
    const { driverId } = req.query;
    if (!driverId) {
      return res.status(400).json({ message: "driverId is required." });
    }

    const requests = await AmbulanceRequest.find({
      assignedDriver: driverId,
    }).sort({ createdAt: -1 });

    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getDriverTrips = async (req, res) => {
  try {
    const { driverId, startDate, endDate } = req.query;
    if (!driverId) {
      return res.status(400).json({ message: "driverId is required." });
    }

    const filter = { driverId };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const trips = await Trip.find(filter).sort({ date: -1 });
    return res.status(200).json(trips);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getDriverEarnings = async (req, res) => {
  try {
    const { driverId, startDate, endDate } = req.query;
    if (!driverId) {
      return res.status(400).json({ message: "driverId is required." });
    }

    const filter = { driverId };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const trips = await Trip.find(filter);
    const total = trips.reduce((sum, trip) => sum + trip.earnings, 0);

    return res.status(200).json({
      totalEarnings: total,
      totalTrips: trips.length,
      pricing: EARNING_MAP,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerDriver,
  loginDriver,
  updateAvailability,
  getAssignedRequests,
  getDriverTrips,
  getDriverEarnings,
  EARNING_MAP,
};
