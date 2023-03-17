import axios from "axios";
import { csrfToken } from "../helpers/server-context";

export const BASE_URL = process.env.REACT_APP_API_URL;

export const client = axios.create({
  baseURL: `${BASE_URL}`,
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "X-CSRF-Token": csrfToken,
  },
  params: {
    format: "json",
  },
  withCredentials: true,
});
