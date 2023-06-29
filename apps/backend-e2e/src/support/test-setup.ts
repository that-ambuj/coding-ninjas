/* eslint-disable */

import axios from "axios";

module.exports = async function() {
  // Configure axios for tests to use.
  const host = process.env.HOST ?? "localhost";
  const port = process.env.PORT ?? "3000";
  axios.defaults.baseURL = `http://${host}:${port}`;
  // Prevent axios from throwing error when testing cases with >300 status
  axios.defaults.validateStatus = () => true;
};
