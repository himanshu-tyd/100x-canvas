import axios from "axios";
import { BASE_URL_HTTP } from "./config";


const api=axios.create({
    baseURL: "/api",
    withCredentials:true
})

export  default api