// Button按钮 Modal对话框
import {
  Button,
  Modal,
  DatePicker,
  TimePicker,
  message,
  Row,
  Col,
  Space,
} from "antd";
//导入scc样式
import "./App.scss";
import { useState } from "react";
// 时间格式调整组件
import moment, { Moment } from "moment";

const App = () => {
  // 用于控制 Modal 显示状态的状态变量
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 后端给我假数据
  const unavailableDates = ["10-09-2024", "12-09-2024", "13-09-2024"];
  //: { [key: string]: string[] }定义一个类型来帮助 TypeScript 识别键的格式
  const unavailableTimes: { [key: string]: string[] } = {
    "11-09-2024": ["10:00", "14:00", "15:00"],
    "12-09-2024": ["09:00", "12:00", "18:00"],
  };
  // selectedDate 存储用户信息
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  //状态值disabledTimes 更新状态的函数setDisabledTimes // 用来存储禁用的时间
  const [disabledTimes, setDisabledTimes] = useState<number[]>([]);
  // 存储用户选中的时间
  const [selectedTime, setSelectedTime] = useState<Moment | null>(null);
  // 点击showClick按钮时触发的函数
  const showClick = () => {
    console.log("showClick()");
    // 显示对话框
    setIsModalOpen(true);
  };

  // Modal 里面的ok按钮
  const handleOk = () => {
    // 校验
    if (!selectedDate) {
      message.warning("Please select a date!");
      return;
    }
    if (!selectedTime) {
      message.warning("Please select a time!");
      return;
    }
    console.log("handleOk");
    if (selectedTime && selectedDate) {
      const selectedDateStr = selectedDate.format("DD-MM-YYYY");
      const selectedTimeStr = selectedTime.format("HH:mm");
      console.log(
        `发送给后端的日期和时间: 日期: ${selectedDateStr}, 时间: ${selectedTimeStr}`
      );
    }
    message.success("Reservation successful!");
    // 清除信息
    setSelectedDate(null);
    setSelectedTime(null);
    // thissimulateSendRequest(selectedDateStr, selectedTimeStr)
    //   .then((response) => {
    //     if (response.status === 200) {
    //       message.success("预约成功！"); // 显示预约成功提示
    //     } else {
    //       message.error("预约失败，请稍后重试。"); // 显示预约失败提示
    //     }
    //   })
    //   .catch(() => {
    //     message.error("预约失败，请稍后重试。"); // 如果请求失败
    //   });
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
    // console.log(
    //   unavailableDates.includes(current.format("DD-MM-YYYY")),
    //   'unavailableDates.includes(current.format("DD-MM-YYYY"));'
    // );

    return unavailableDates.includes(current.format("DD-MM-YYYY"));
  };

  // 当日期变化时触发
  const handleDateChange = (date: Moment | null) => {
    // 用户选择新日期后更新selectedDate的值
    setSelectedDate(date);
    console.log("handleDateChange");
    if (date) {
      const selectedDateStr = date.format("DD-MM-YYYY");
      console.log(selectedDateStr, "selectedDateStr 点击选择的日期");
      console.log(unavailableTimes, "unavailableTimes 后端给传的不可用的时间");

      const unavailable = unavailableTimes[selectedDateStr];
      if (unavailable) {
        // 把后端传的不可用的时间段转换成数组然后在页面禁用
        const hours = unavailable.map((time) => moment(time, "HH:mm").hour());
        console.log(hours);
        setDisabledTimes(hours); // 将禁用的时间段存储到状态中
        // 在这里处理不可用的时间段，例如存储在一个状态中
        console.log(
          `该日期 ${selectedDateStr} 的不可用时间段是: `,
          unavailable
        );
      } else {
        setDisabledTimes([]);
        console.log(`该日期 ${selectedDateStr} 没有不可用的时间段`);
      }
    }
  };

  // 禁用已经预定的时间
  const disabledTime = () => {
    console.log("disabledTime");
    return {
      disabledHours: () => disabledTimes, // 禁用这些时间段
    };
  };

  // 当时间变化时触发
  const handleTimeChange = (time: Moment | null) => {
    console.log("handleTimeChange");
    // 保存选择的时间 异步更新所以不在控制台直接显示
    setSelectedTime(time);
    console.log(time ? time.format("HH:mm") : "无时间", "选择的时间"); // 打印选择的时间
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
            <TimePicker
              disabledTime={disabledTime}
              onChange={handleTimeChange}
              value={selectedTime}
              format="HH:mm"
              style={{ width: "100%" }}
              placeholder="Please select a time"
            />
          </Space>
        </Modal>
      </main>
    </div>
  );
};

export default App;
