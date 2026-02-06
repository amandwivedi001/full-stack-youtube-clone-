import api from "./axios";

export const toggleVideoLike = (videoId) => 
    api.post(`/likes/${videoId}`);

export const toggleCommentLike = (commentId) =>
    api.post(`/likes/${commentId}`);