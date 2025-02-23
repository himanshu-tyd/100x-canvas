import axios from "axios";
import { BASE_URL_HTTP } from "./config";

const url=process.env.NEXT_PUBLIC_HTTP_SERVER ?? BASE_URL_HTTP

const api = axios.create({
  baseURL: url ,
  withCredentials: true,
});

export default api;

