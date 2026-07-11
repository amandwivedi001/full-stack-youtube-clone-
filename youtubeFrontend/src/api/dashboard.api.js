import api from "./axios";

export const getDashboardStats = () => api.get("/dashboard/stats");

export const getDashboardVideos = () => api.get("/dashboard/videos");
