import api from "./axios";

export const registerUser = (data) => {
  const formData = new FormData();

  formData.append("fullname", data.fullname);
  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);

  if (data.avatar) {
    formData.append("avatar", data.avatar);
  }

  // only if you plan to send coverImage later
  // formData.append("coverImage", data.coverImage);

  return api.post("/user/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const loginUser = (data) => api.post("/user/login", data);
export const logoutUser = () => api.post("/user/logOut");
export const getCurrentUser = () => api.get("/user/current-user");


