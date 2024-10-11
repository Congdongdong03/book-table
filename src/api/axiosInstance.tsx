import axios from "axios";
import { message } from "antd"; // Import Ant Design's message component to display global error messages

// Create an axios instance and set the base configuration
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:5000/reservations/", // Backend base URL
  timeout: 10000, // Request timeout limit in milliseconds
  headers: {
    "Content-Type": "application/json", // Set content type to JSON for all requests
  },
});

// Add request interceptor (optional)
// Interceptors can handle tasks before a request is sent, such as adding an authorization token
apiClient.interceptors.request.use(
  (config) => {
    // Common request logic, such as adding a token, can be added here
    return config;
  },
  (error) => {
    // Handle request errors before they are sent
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Process the response data before passing it on
    return response;
  },
  (error) => {
    // Handle errors in the response
    if (error.response) {
      // If the server returns an error response, handle it by displaying a message
      message.error(
        `Error: ${error.response.data.message || "Something went wrong!"}`
      );
    } else {
      // Handle cases where the request fails to reach the server
      message.error("Network error or server is down.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
