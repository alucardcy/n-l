import axios from "axios";
import type { AxiosInstance } from "axios";

// Vite exposes env variables on import.meta.env but we are gonna hardcode it cause 
//  you dont need to waste time setting up envs 
const BASE_URL = (import.meta as any).env?.VITE_API_BASE || "http://localhost:3000";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;

