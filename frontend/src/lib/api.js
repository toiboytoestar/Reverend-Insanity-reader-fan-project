import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const fetchNovel = () => api.get("/novel").then((r) => r.data);
export const fetchChapters = (params = {}) =>
  api.get("/chapters", { params }).then((r) => r.data);
export const fetchChapter = (id) => api.get(`/chapters/${id}`).then((r) => r.data);
