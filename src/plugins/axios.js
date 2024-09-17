import axios from "axios";

const baseURL = import.meta.env.VITE_SERVER_URL + "/api"; 

const axiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

const token = localStorage.getItem("access-token");
if (token != null) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default axiosInstance;