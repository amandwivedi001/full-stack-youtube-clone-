import api from "./axios";

export const getVideoComments = (videoId) => 
    api.get(`/comments/${videoId}`);

export const addComment = (videoId, comment) =>
    api.post(`/comments/${videoId}`, {comment});

export const deleteComment = (commentId) => 
    api.delete(`/comments/${commentId}`);

export const updateComment = (commentId, comment) =>
  api.patch(`/comments/c/${commentId}`, { comment });
