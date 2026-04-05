import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const ambulanceService = {
  book: (payload) => api.post("/ambulance/book", payload),
  track: (params) => api.get("/track", { params }),
};

export const driverService = {
  register: (payload) => api.post("/driver/register", payload),
  login: (payload) => api.post("/driver/login", payload),
  updateAvailability: (payload) => api.patch("/driver/availability", payload),
  getAssignedRequests: (driverId) =>
    api.get("/driver/assigned-requests", { params: { driverId } }),
  getTrips: (params) => api.get("/driver/trips", { params }),
  getEarnings: (params) => api.get("/driver/earnings", { params }),
};

export const adminService = {
  login: (payload) => api.post("/admin/login", payload),
  getRequests: () => api.get("/requests"),
  getAvailableDrivers: () => api.get("/admin/drivers"),
  assignDriver: (payload) => api.post("/assign-driver", payload),
};

export default api;
