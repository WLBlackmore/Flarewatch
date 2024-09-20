import React from "react";
import Slider from "@mui/material/Slider";

const marks = [
  { value: 0 },
  { value: 6 },
  { value: 12 },
  { value: 18 },
  { value: 24 },
];

const valueLabelFormat = (value) => {
  return value === 0 ? "Now" : `${value} hours ago`;
};

const TimeSlider = ({ timeFilter, setTimeFilter }) => {
  const handleChange = (event, newValue) => {
    if (newValue[0] === newValue[1]) {
      return;
    }
    setTimeFilter(newValue);
  };

  return (
    <Slider
      value={timeFilter}
      onChange={handleChange}
      valueLabelDisplay="auto"
      valueLabelFormat={valueLabelFormat}
      min={0}
      max={24}
      marks={marks}
      step={null}
      disableSwap={true}
    />
  );
};

export default TimeSlider;
