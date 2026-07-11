import api from "./axios";

export const getUserChannel = (username) =>
    api.get(`/user/c/${username}`);

export const getChannelVideos = (userId) => 
    api.get("/videos", { params: { userId } });

export const toggleSubscription = (channelId) =>
    api.post(`/subscriptions/c/${channelId}`);

export const getSubscribedVideos = () =>
    api.get("/subscriptions/feed");