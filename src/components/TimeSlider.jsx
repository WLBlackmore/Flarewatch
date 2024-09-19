import React, { useState } from 'react';
import Slider from '@mui/material/Slider';

const marks = [
  { value: 0 },
  { value: 6 },
  { value: 12 },
  { value: 18 },
  { value: 24 },
];

function valueLabelFormat(value) {
  return value === 0 ? 'Now' : `${value} hours ago`;
}

function CustomRangeSlider() {
  const [value, setValue] = useState([0, 24]); 

  const handleChange = (event, newValue) => {
    if (newValue[0] === newValue[1]) {
        return;
      }
    setValue(newValue);
  };

  return (
    <Slider
      value={value}
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
}

export default CustomRangeSlider;
