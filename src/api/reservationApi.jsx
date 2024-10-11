import apiClient from "./axiosInstance"; // 引入封装的 axios 实例

// API function to make a reservation
export const makeReservation = (date, time) => {
  return apiClient.post("/reserve", {
    date: date,
    time: time,
  });
};
// API function to fetch unavailable dates
export const getUnavailableDates = (date, time) => {
  return apiClient.get("/unavailable_dates", {
    date: date,
    time: time,
  });
};
// API function to fetch unavailable times for a specific date
export const getUnavailableTimesForDate = (date) => {
  return apiClient.get(`/unavailable_times/${date}`);
};
