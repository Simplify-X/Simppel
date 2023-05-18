// @ts-nocheck

import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

const CustomInputChip = () => {
  const [inputValue, setInputValue] = useState('');
  const [chips, setChips] = useState([]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const trimmedValue = inputValue.trim();
      if (trimmedValue) {
        setChips((prevChips) => [...prevChips, trimmedValue]);
      }
      setInputValue('');
    }
  };

  const handleChipDelete = (chipIndex) => {
    setChips((prevChips) => prevChips.filter((_, index) => index !== chipIndex));
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '8px' }}>
        {chips.map((chip, index) => (
          <Chip
            key={index}
            label={chip}
            onDelete={() => handleChipDelete(index)}
            style={{ marginRight: '8px', marginBottom: '8px' }}
          />
        ))}
      </div>
      <TextField
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        label="Enter values"
        variant="outlined"
        fullWidth
      />
    </div>
  );
};

export default CustomInputChip;
