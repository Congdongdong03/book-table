import axios from "axios";
import { message } from "antd"; // 使用 Ant Design 的消息组件来显示全局错误

// 创建 axios 实例，并设置基础配置
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:5000/reservations/", // 后端的基础 URL
  timeout: 10000, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
});

// 添加请求拦截器（可选）
// 拦截器可以在请求发送之前做一些处理，比如添加授权 token
apiClient.interceptors.request.use(
  (config) => {
    // 可以在此处添加通用的请求逻辑，例如 token
    return config;
  },
  (error) => {
    // 在请求出错时，统一处理
    return Promise.reject(error);
  }
);

// 添加响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      // 服务端返回错误的情况，统一处理错误信息
      message.error(
        `Error: ${error.response.data.message || "Something went wrong!"}`
      );
    } else {
      // 客户端请求未发送成功
      message.error("Network error or server is down.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
