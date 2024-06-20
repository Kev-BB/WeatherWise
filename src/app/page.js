"use client";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import DatePicker from "react-datepicker";
import moment from "moment";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { WiDayFog } from "react-icons/wi";
import { useState } from "react";

import "react-datepicker/dist/react-datepicker.css";

export default function Home() {
  const [preference, setPreference] = useState("daily");
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [showAlert, setShowAlert] = useState(false);

  const currentDate = new Date();
  const diffTime = Math.abs(endDate - currentDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const days = diffDays;

  const handleChange = (event, newPreference) => {
    setPreference(newPreference);
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleSearch = async () => {
    let apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=&q=${city}&aqi=no&alerts=no`;
    if (preference === "daily" && endDate) {
      if (startDate.toDateString() !== currentDate.toDateString() || diffDays > 10) {
        setShowAlert(true);
      } else {
        setShowAlert(false);
      }
  
      apiUrl += `&days=${days}`;
    } else if (preference === "hourly" && selectedDate) {
      const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
      apiUrl += `&dt=${formattedDate}&hours=24`;
    }
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <main>
      <div className="flex justify-center">
      {showAlert && (
    <>
      {startDate !== currentDate && (
        <Alert
          className="w-96 mt-2 z-50 fixed"
          variant="filled"
          severity="error"
          onClose={() => {
            setShowAlert(false);
          }}
        >
          Start date is not today.
        </Alert>
      )}
      {diffDays > 10 && (
        <Alert
          className="w-96 mt-2 z-50 fixed"
          variant="filled"
          severity="error"
          onClose={() => {
            setShowAlert(false);
          }}
        >
          You cannot select more than 10 days.
        </Alert>
      )}
    </>
  )}
      </div>
      <div className="flex flex-row items-center justify-center mt-9 gap-5">
        <h1 className="font-bold text-4xl text-slate-50">WeatherWise</h1>
        <WiDayFog className="scale-[2.5] text-slate-50" />
      </div>
      <div className="input-container flex justify-center items-center mt-12 gap-5">
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="city-input">City</InputLabel>
            <Select
              className="bg-white"
              value={city}
              label="City"
              onChange={handleCityChange}
            >
              <MenuItem value="İstanbul">İstanbul</MenuItem>
              <MenuItem value="Ankara">Ankara</MenuItem>
              <MenuItem value="İzmir">İzmir</MenuItem>
              <MenuItem value="Antalya">Antalya</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {preference === "daily" && (
          <DatePicker
            className="border-2 p-3.5 rounded"
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            placeholderText="Pick a date"
            onChange={(update) => {
              setDateRange(update);
            }}
          />
        )}
        {preference === "hourly" && (
          <DatePicker
            className="border-2 p-3.5 rounded"
            selected={selectedDate}
            minDate={new Date()}
            placeholderText="Pick a date"
            onChange={(date) => {
              setSelectedDate(date);
              setDateRange([date, date]);
            }}
          />
        )}
        <ToggleButtonGroup
          className="bg-white "
          color="primary"
          value={preference}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="daily">Daily</ToggleButton>
          <ToggleButton value="hourly">Hourly</ToggleButton>
        </ToggleButtonGroup>
        <Button
          className="p-3"
          variant="contained"
          endIcon={<SearchIcon />}
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
      {weatherData && preference === "hourly" && (
        <table className="table-auto m-auto mt-10">
          <thead>
            <tr>
              <th>Time</th>
              <th>Icon</th>
              <th className="pr-5">Temperature (°C)</th>
              <th className="wind pr-5">Wind (kph)</th>
              <th className="pr-5">Condition</th>
              <th className=" humidity pr-5">Humidity</th>
            </tr>
          </thead>
          <tbody>
            {weatherData.forecast.forecastday[0].hour.map(
              (hourlyData, id = crypto.randomUUID()) => (
                <tr className="even:bg-gray-200 odd:bg-white" key={id}>
                  <td className="p-5">{hourlyData.time}</td>
                  <td>
                    <img
                    className="weather-icon"
                      src={`https:${hourlyData.condition.icon}`}
                      alt="Weather Icon"
                    />
                  </td>
                  <td className="temp-data">{hourlyData.temp_c}°C</td>
                  <td className="wind-data">{hourlyData.wind_kph} kph</td>
                  <td>{hourlyData.condition.text}</td>
                  <td className="humidity-data">{hourlyData.humidity}%</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
      {weatherData && preference === "daily" && (
        <div className="flex flex-wrap justify-center gap-5 mt-10">
          {weatherData.forecast.forecastday.map(
            (dailyData, id = crypto.randomUUID()) => (
              <Card
                keys={id}
                className="w-96 p-2 flex items-center justify-around bg-gradient-to-r from-amber-500 to-pink-500"
              >
                <CardContent className="mt-2 flex flex-col items-center gap-3">
                  <Typography
                    sx={{ fontSize: 18 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {dailyData.date}
                  </Typography>
                  <img
                    className="scale-[1.5]"
                    src={`https:${dailyData.day.condition.icon}`}
                    alt="Weather Icon"
                  />
                  <Typography variant="h5" component="div">
                    {dailyData.day.condition.text}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {dailyData.day.avgtemp_c}°C
                  </Typography>
                </CardContent>
                <div className="flex flex-col">
                  <Typography variant="p" color="text.secondary">
                    Max Temp: {dailyData.day.maxtemp_c}°C
                  </Typography>
                  <Typography variant="p" color="text.secondary">
                    Min Temp: {dailyData.day.mintemp_c}°C <br />
                  </Typography>
                  <Typography variant="p" color="text.secondary">
                    Humidity: {dailyData.day.avghumidity}% <br />
                  </Typography>
                </div>
              </Card>
            )
          )}
        </div>
      )}
      <div className="custom-shape-divider-bottom-1718732546">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="shape-fill"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="shape-fill"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
    </main>
  );
}
