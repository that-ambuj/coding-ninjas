import axios from "axios";

export const isDevMode = process.env.NODE_ENV === "development";

export function setEnvironment() {
  if (isDevMode) {
    axios.defaults.baseURL = "http://localhost:3000";
  } else {
    axios.defaults.baseURL = process.env.HOST;
  }
}
