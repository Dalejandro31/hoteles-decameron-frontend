import axios from "axios";

const api = axios.create({
    baseURL: "https://hoteles-decameron-production.up.railway.app/api"
});

export default api;

