import axios from "axios";
import { message } from "antd"; // Use Ant Design's message component to display global error messages

// Create an axios instance and set base configuration
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000", // Base URL of the backend
  timeout: 10000, // Request timeout duration
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor (optional)
// Interceptor can handle tasks before the request is sent, such as adding authorization token
apiClient.interceptors.request.use(
  (config) => {
    // You can add common request logic here, such as adding a token
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Process response data
    return response;
  },
  (error) => {
    // Handle response errors
    if (error.response) {
      // Handle server-side errors and show a unified error message
      message.error(
        `Error: ${error.response.data.message || "Something went wrong!"}`
      );
    } else {
      // Handle errors when the client request was not sent successfully
      message.error("Network error or server is down.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
