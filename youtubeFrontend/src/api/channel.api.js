import api from "./axios";

export const getUserChannel = (username) =>
    api.get(`/user/c/${username}`);

export const getChannelVideos = (userId) => 
    api.get(`/videos?userId=${userId}`);

export const toggleSubscription = (channelId) =>
    api.get(`/subscriptions/c/${channelId}`);