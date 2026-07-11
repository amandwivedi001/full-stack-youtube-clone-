import api from "./axios";

export const getWatchHistory = () => api.get("/user/history");

export const getLikedVideos = () => api.get("/likes/videos");