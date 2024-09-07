// Button按钮 Modal对话框
import {
  Button,
  Modal,
  DatePicker,
  message,
  Row,
  Col,
  Space,
  Select,
} from "antd";
//导入scc样式
import "./App.scss";
import { useState } from "react";
// 时间格式调整组件
import moment, { Moment } from "moment";
// 导入封装好的 API 函数
import {
  makeReservation,
  getUnavailableDates,
  getUnavailableTimesForDate,
} from "./api/reservationApi";

const { Option } = Select;
const App = () => {
  // 用于控制 Modal 显示状态的状态变量
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 后端给我假数据
  // const unavailableDates = ["10-09-2024", "12-09-2024", "13-09-2024"];
  // //: { [key: string]: string[] }定义一个类型来帮助 TypeScript 识别键的格式
  // const unavailableTimes: { [key: string]: string[] } = {
  //   "11-09-2024": ["10:00", "14:00", "15:00"],
  //   "12-09-2024": ["09:00", "12:00", "18:00"],
  // };
  // selectedDate 存储用户信息
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  //状态值disabledTimes 更新状态的函数setDisabledTimes // 用来存储禁用的时间
  // const [disabledTimes, setDisabledTimes] = useState<number[]>([]);
  // 存储用户选中的时间
  const [selectedTime, setSelectedTime] = useState<Moment | null>(null);
  // 存储可用的时间段
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);

  // 点击showClick按钮时触发的函数
  const showClick = () => {
    // 清除信息
    setSelectedDate(null);
    setSelectedTime(null);
    console.log("showClick()");
    // 显示对话框
    setIsModalOpen(true);
    // 查接口哪些是禁用的
    getUnavailableDates().then((res: { data: any }) => {
      console.log(res, "getUnavailableDates");
      // 假设 res.data 包含不可用日期和时间
      const { unavailable_dates } = res.data;
      setUnavailableDates(unavailable_dates); // 存储不可用日期
    });
  };

  // Modal 里面的ok按钮
  const handleOk = () => {
    // 校验
    // if (!selectedDate) {
    //   message.warning("Please select a date!");
    //   return;
    // }
    // if (!selectedTime) {
    //   message.warning("Please select a time!");
    //   return;
    // }
    if (!selectedDate || !selectedTime) {
      message.warning("Please select both date and time!");
      return;
    }

    console.log("handleOk");
    // if (selectedTime && selectedDate) {
    const selectedDateStr = selectedDate.format("DD-MM-YYYY");
    const selectedTimeStr = selectedTime.format("HH:mm");
    console.log(
      `发送给后端的日期和时间: 日期: ${selectedDateStr}, 时间: ${selectedTimeStr}`
    );
    // }

    // 调用封装的 makeReservation 函数
    makeReservation(selectedDateStr, selectedTimeStr)
      .then((response: { data: any }) => {
        const data = response.data;
        if (data.status === "success") {
          message.success(data.message);
        } else {
          message.error(data.message);
        }
      })
      .catch(() => {
        message.error("Reservation failed. Please try again.");
      });
    message.success("Reservation successful!");
    // 清除信息
    setSelectedDate(null);
    setSelectedTime(null);
    setIsModalOpen(false);
  };

  // Modal 里面的Cancel的 logo
  const handleCancel = () => {
    console.log("handleCancel");
    setIsModalOpen(false);
  };

  // 禁用过去的日期 只能还会布尔值  只要是返回true 就是禁用
  const disabledDate = (current: Moment) => {
    // console.log("disabledDate");
    // 当前时间 && 判断current < moment().endOf('day') 是否是今天之前的日期，如果是就返回 true 禁用该日期
    if (current && current < moment().endOf("day")) {
      return true;
    }
    // 确保 `unavailableDates` 正确被赋值并且是数组
    // if (unavailableDates && Array.isArray(unavailableDates)) {
    //   return unavailableDates.includes(current.format("DD-MM-YYYY"));
    // }
    // console.log(
    //   unavailableDates.includes(current.format("DD-MM-YYYY")),
    //   'unavailableDates.includes(current.format("DD-MM-YYYY"));'
    // );

    return unavailableDates.includes(current.format("DD-MM-YYYY"));
  };

  // 当日期变化时触发
  // const handleDateChange = (date: Moment | null) => {
  //   setSelectedDate(date);
  //   if (date) {
  //     const selectedDateStr = date.format("DD-MM-YYYY");
  //     // const unavailable = unavailableTimes[selectedDateStr] || [];
  //     const unavailable =
  //       (unavailableTimes && unavailableTimes[selectedDateStr]) || [];
  //     // 生成所有时间段（8:00, 10:00, 12:00, ..., 20:00）
  //     const allTimes = [
  //       "08:00",
  //       "10:00",
  //       "12:00",
  //       "14:00",
  //       "16:00",
  //       "18:00",
  //       "20:00",
  //     ];
  //     // 过滤掉不可用的时间
  //     const available = allTimes.filter((time) => !unavailable.includes(time));

  //     setAvailableTimes(available); // 更新可用时间
  //   } else {
  //     setAvailableTimes([]); // 如果没有日期被选中，则清空可用时间
  //   }
  // };
  const handleDateChange = (date: Moment | null) => {
    setSelectedDate(date);

    if (date) {
      const selectedDateStr = date.format("DD-MM-YYYY");

      // 调用后端 API 获取该日期的不可用时间段
      getUnavailableTimesForDate(selectedDateStr).then((res: { data: any }) => {
        const unavailable = res.data.unavailable_times || [];

        // 生成所有时间段（8:00, 10:00, 12:00, ..., 20:00）
        const allTimes = [
          "08:00",
          "10:00",
          "12:00",
          "14:00",
          "16:00",
          "18:00",
          "20:00",
        ];

        // 过滤掉不可用的时间段
        const available = allTimes.filter(
          (time) => !unavailable.includes(time)
        );

        // 更新可用时间段
        setAvailableTimes(available);
      });
    } else {
      setAvailableTimes([]); // 如果没有选择日期，则清空可用时间
    }
  };

  // 禁用已经预定的时间
  // const disabledTime = () => {
  //   // 固定的时间间隔：每隔两小时一个时间段
  //   const availableSlots = [8, 10, 12, 14, 16, 18, 20];

  //   return {
  //     disabledHours: () => {
  //       // 禁用所有不在 availableSlots 里面的时间段
  //       const allHours = Array.from({ length: 24 }, (_, i) => i); // 生成0到23小时的数组
  //       const disabledHours = allHours.filter(
  //         (hour) => !availableSlots.includes(hour)
  //       );

  //       // 加入已经被预定的时间
  //       const unavailableHours = availableSlots.filter((hour) =>
  //         disabledTimes.includes(hour)
  //       );

  //       // 返回两个数组的并集，禁用这些时间
  //       return [...disabledHours, ...unavailableHours];
  //     },
  //   };
  // };

  // 当时间变化时触发
  const handleTimeChange = (value: string) => {
    console.log("handleTimeChange");
    setSelectedTime(moment(value, "HH:mm")); // 将字符串时间转换为 Moment 对象
    console.log(value, "选择的时间");
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Table Reservation System</h1>
      </header>

      <main className="main-content">
        {/* 使用 Row 和 Col 进行页面布局 */}
        <Row justify="center">
          <Col>
            <Button
              type="primary"
              onClick={showClick}
              size="large"
              style={{ marginBottom: "20px" }}
            >
              Book a table
            </Button>
          </Col>
        </Row>

        <Modal
          title={
            <h2 style={{ fontWeight: "bold" }}>
              Please select a reservation date and time
            </h2>
          }
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          {/* 使用 Space 调整日期和时间选择器的间距 */}
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <DatePicker
              disabledDate={disabledDate}
              onChange={handleDateChange}
              value={selectedDate}
              style={{ width: "100%" }}
              placeholder="Please select date"
            />
            <Select
              placeholder="Please select a time"
              style={{ width: "100%" }}
              onChange={handleTimeChange}
              value={selectedTime ? selectedTime.format("HH:mm") : undefined}
            >
              {availableTimes.map((time) => (
                <Option key={time} value={time}>
                  {time}
                </Option>
              ))}
            </Select>

            {/* <Select
              placeholder="Please select a time"
              style={{ width: "100%" }}
              onChange={handleTimeChange}
              value={selectedTime ? selectedTime.format("HH:mm") : undefined}
            >
              <Option value="08:00">08:00</Option>
              <Option value="10:00">10:00</Option>
              <Option value="12:00">12:00</Option>
              <Option value="14:00">14:00</Option>
              <Option value="16:00">16:00</Option>
              <Option value="18:00">18:00</Option>
              <Option value="20:00">20:00</Option>
            </Select> */}
          </Space>
        </Modal>
      </main>
    </div>
  );
};

export default App;
