// Import necessary components from Ant Design
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
// Import CSS styles
import "./App.scss";
import { useState } from "react";
// Import moment for date formatting and manipulation
import moment, { Moment } from "moment";
// Import API functions
import {
  makeReservation,
  getUnavailableDates,
  getUnavailableTimesForDate,
} from "./api/reservationApi";

const { Option } = Select;
const App = () => {
  // State variable to control the visibility of the Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Store the user's selected date
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  // Store the user's selected time
  const [selectedTime, setSelectedTime] = useState<Moment | null>(null);
  // Store the available time slots
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  // Store the unavailable dates fetched from the API
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);

  // Function triggered when the "Book a table" button is clicked
  const showClick = () => {
    // Clear previous selections
    setSelectedDate(null);
    setSelectedTime(null);
    console.log("showClick()");
    // Show the Modal
    setIsModalOpen(true);
    // Fetch unavailable dates from the API
    getUnavailableDates().then((res: { data: any }) => {
      console.log(res, "getUnavailableDates");
      const { unavailable_dates } = res.data;
      setUnavailableDates(unavailable_dates); // Store the unavailable dates
    });
  };

  // Function triggered when the OK button in the Modal is clicked
  const handleOk = () => {
    // Validation checks
    if (!selectedDate || !selectedTime) {
      message.warning("Please select both date and time!");
      return;
    }

    console.log("handleOk");
    const selectedDateStr = selectedDate.format("DD-MM-YYYY");
    const selectedTimeStr = selectedTime.format("HH:mm");
    console.log(
      `Sending to backend: Date: ${selectedDateStr}, Time: ${selectedTimeStr}`
    );

    // Call the makeReservation function to send data to the backend
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
    // Clear selections and close the Modal
    setSelectedDate(null);
    setSelectedTime(null);
    setIsModalOpen(false);
  };

  // Function triggered when the Cancel button in the Modal is clicked
  const handleCancel = () => {
    console.log("handleCancel");
    setIsModalOpen(false);
  };

  // Disable past dates and dates that are unavailable
  const disabledDate = (current: Moment) => {
    // Disable dates that are in the past
    if (current && current < moment().endOf("day")) {
      return true;
    }
    // Disable unavailable dates from the API
    return unavailableDates.includes(current.format("DD-MM-YYYY"));
  };

  // Triggered when the user selects a date
  const handleDateChange = (date: Moment | null) => {
    setSelectedDate(date);

    if (date) {
      const selectedDateStr = date.format("DD-MM-YYYY");

      // Fetch unavailable time slots for the selected date from the API
      getUnavailableTimesForDate(selectedDateStr).then((res: { data: any }) => {
        const unavailable = res.data.unavailable_times || [];

        // Define all possible time slots (e.g., 8:00, 10:00, etc.)
        const allTimes = [
          "08:00",
          "10:00",
          "12:00",
          "14:00",
          "16:00",
          "18:00",
          "20:00",
        ];

        // Filter out unavailable time slots
        const available = allTimes.filter(
          (time) => !unavailable.includes(time)
        );

        // Update available time slots
        setAvailableTimes(available);
      });
    } else {
      setAvailableTimes([]); // Clear available times if no date is selected
    }
  };

  // Triggered when the user selects a time
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
        {/* Use Row and Col for layout */}
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
          {/* Use Space to adjust the spacing of the date and time pickers */}
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
