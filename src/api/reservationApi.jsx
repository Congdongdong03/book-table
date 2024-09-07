import apiClient from "./axiosInstance"; // 引入封装的 axios 实例

// 预定请求的 API 函数
export const makeReservation = (date, time) => {
  return apiClient.post("/reserve", {
    date: date,
    time: time,
  });
};
// 查询不可用日期
export const getUnavailableDates = (date, time) => {
  return apiClient.get("/unavailable_dates", {
    date: date,
    time: time,
  });
};
export const getUnavailableTimesForDate = (date) => {
  return apiClient.get(`/unavailable_times/${date}`);
};
