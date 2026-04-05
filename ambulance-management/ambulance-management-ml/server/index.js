const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const ambulanceRoutes = require("./routes/ambulanceRoutes");
const driverRoutes = require("./routes/driverRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { getRequests, trackAmbulance } = require("./controllers/ambulanceController");
const { assignDriver } = require("./controllers/adminController");
const { getDriverTrips, getDriverEarnings } = require("./controllers/driverController");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.get("/api/requests", getRequests);
app.post("/api/assign-driver", assignDriver);
app.get("/api/track", trackAmbulance);
app.get("/api/driver/trips", getDriverTrips);
app.get("/api/driver/earnings", getDriverEarnings);

app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/admin", adminRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
