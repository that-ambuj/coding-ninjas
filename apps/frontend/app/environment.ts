import axios from "axios";

export const isDevMode = process.env.NODE_ENV === "development";

export function setEnvironment() {
  if (isDevMode) {
    axios.defaults.baseURL = "http://localhost:3000";
  } else {
    const protocol = process.env.PROTOCOL ?? "http://";
    let host = protocol + process.env.HOST ?? "localhost";

    if (process.env.SERVER_PORT) {
      host += `:${process.env.SERVER_PORT}`;
    }

    axios.defaults.baseURL = host;
  }
}
