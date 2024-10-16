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
// Import the CSS styles
import "./App.scss";
import { useState } from "react";
// Moment.js for time formatting
import moment, { Moment } from "moment";
// Import the API functions
import {
  makeReservation,
  getUnavailableDates,
  getUnavailableTimesForDate,
} from "./api/reservationApi";

const { Option } = Select;
const App = () => {
  // State variable to control Modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to store the selected date
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  // State to store the selected time
  const [selectedTime, setSelectedTime] = useState<Moment | null>(null);
  // State to store available time slots
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  // State to store unavailable dates
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);

  // Function triggered when the 'showClick' button is clicked
  const showClick = () => {
    // Clear the previous selections
    setSelectedDate(null);
    setSelectedTime(null);
    console.log("showClick()");
    // Display the Modal
    setIsModalOpen(true);
    // Fetch unavailable dates from the API
    getUnavailableDates().then((res: { data: any }) => {
      console.log(res, "getUnavailableDates");
      const { unavailable_dates } = res.data;
      setUnavailableDates(unavailable_dates); // Store unavailable dates
    });
  };

  // Function for the 'Ok' button inside the Modal
  const handleOk = () => {
    if (!selectedDate || !selectedTime) {
      message.warning("Please select both date and time!");
      return;
    }

    console.log("handleOk");
    const selectedDateStr = selectedDate.format("DD-MM-YYYY");
    const selectedTimeStr = selectedTime.format("HH:mm");
    console.log(
      `Sending the following date and time to the server: Date: ${selectedDateStr}, Time: ${selectedTimeStr}`
    );

    // Call the makeReservation API function
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

    // Clear selections and close the Modal
    setSelectedDate(null);
    setSelectedTime(null);
    setIsModalOpen(false);
  };

  // Function for the 'Cancel' button inside the Modal
  const handleCancel = () => {
    console.log("handleCancel");
    setIsModalOpen(false);
  };

  // Disable past dates and already booked dates
  const disabledDate = (current: Moment) => {
    if (current && current < moment().endOf("day")) {
      return true;
    }
    if (unavailableDates && Array.isArray(unavailableDates)) {
      return unavailableDates.includes(current.format("DD-MM-YYYY"));
    }
    return false;
  };

  // Triggered when the date is changed
  const handleDateChange = (date: Moment | null) => {
    setSelectedDate(date);

    if (date) {
      const selectedDateStr = date.format("DD-MM-YYYY");

      // Fetch unavailable times for the selected date from the API
      getUnavailableTimesForDate(selectedDateStr).then((res: { data: any }) => {
        const unavailable = res.data.unavailable_times || [];
        console.log(res.data, "unavailable");

        // Generate available time slots
        const allTimes = [
          "08:00",
          "10:00",
          "12:00",
          "14:00",
          "16:00",
          "18:00",
          "20:00",
        ];

        // Filter out unavailable times
        const available = allTimes.filter(
          (time) => !unavailable.includes(time)
        );
        console.log(available);
        // Update available times
        setAvailableTimes(available);
      });
    } else {
      setAvailableTimes([]); // Clear available times if no date is selected
    }
  };

  // Triggered when the time is changed
  const handleTimeChange = (value: string) => {
    console.log("handleTimeChange");
    setSelectedTime(moment(value, "HH:mm")); // Convert the selected time to a Moment object
    console.log(value, "Selected time");
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Table Reservation System</h1>
      </header>

      <main className="main-content">
        {/* Layout using Row and Col components */}
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
          {/* Use Space component to adjust the spacing between DatePicker and Select */}
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
          </Space>
        </Modal>
      </main>
    </div>
  );
};

export default App;
