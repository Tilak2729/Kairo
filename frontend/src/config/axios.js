import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Replace with your backend URL
  headers: {
    "Authorization" : `Bearer ${localStorage.getItem('token')}`
  }
});

export default axiosInstance;