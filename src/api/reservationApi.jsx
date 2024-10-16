import apiClient from "./axiosInstance"; // Import the encapsulated axios instance

// API function for making a reservation
export const makeReservation = (date, time) => {
  return apiClient.post("/reserve", {
    date: date,
    time: time,
  });
};

// API function to query unavailable dates
export const getUnavailableDates = (date, time) => {
  return apiClient.get("/unavailable_dates", {
    date: date,
    time: time,
  });
};

// API function to get unavailable times for a specific date
export const getUnavailableTimesForDate = (date) => {
  return apiClient.get(`/unavailable_times/${date}`);
};
