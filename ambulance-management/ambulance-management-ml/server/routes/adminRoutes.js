const express = require("express");
const { loginAdmin, assignDriver } = require("../controllers/adminController");
const { getRequests, getAvailableDrivers } = require("../controllers/ambulanceController");

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/requests", getRequests);
router.get("/drivers", getAvailableDrivers);
router.post("/assign-driver", assignDriver);

module.exports = router;
