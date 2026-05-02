export const saveToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const clearToken = () => localStorage.removeItem("token");
export const isAuthenticated = () => !!getToken();
export const saveUser = (user) => localStorage.setItem("user", JSON.stringify(user));
export const getUser = () => JSON.parse(localStorage.getItem("user") || "null");
export const clearUser = () => localStorage.removeItem("user");
