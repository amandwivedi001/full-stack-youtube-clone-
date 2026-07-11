import api from "./axios";

export const getAllVideos = (params = {}) => {
    return (
        api.get("/videos/", {params})
    )
}

export const getVideoById = (videoId) => {
    return (
        api.get(`/videos/${videoId}`)
    )
}

export const publishVideo = (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("videoFile", data.videoFile);
    formData.append("thumbnail", data.thumbnail);

    return api.post("/videos/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const updateVideo = (videoId, data) => {
    const formData = new FormData();

    if (data.title !== undefined) formData.append("title", data.title);
    if (data.description !== undefined) formData.append("description", data.description);
    if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

    return api.patch(`/videos/${videoId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteVideo = (videoId) => api.delete(`/videos/${videoId}`);

export const togglePublishStatus = (videoId) =>
    api.patch(`/videos/toggle/publish/${videoId}`);

export const getRecommendedVideos = (videoId, params = {}) =>
    api.get(`/videos/${videoId}/recommendations`, { params });