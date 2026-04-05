const express = require("express");
const {
  registerDriver,
  loginDriver,
  updateAvailability,
  getAssignedRequests,
  getDriverTrips,
  getDriverEarnings,
} = require("../controllers/driverController");

const router = express.Router();

router.post("/register", registerDriver);
router.post("/login", loginDriver);
router.patch("/availability", updateAvailability);
router.get("/assigned-requests", getAssignedRequests);
router.get("/trips", getDriverTrips);
router.get("/earnings", getDriverEarnings);

module.exports = router;
