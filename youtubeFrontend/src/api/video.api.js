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


