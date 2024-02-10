// @ts-nocheck
import React from 'react';
import { Controller } from 'react-hook-form';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';

const FormDatePicker = ({
  name,
  control,
  defaultValue,
  label,
  labelKey,
  hidden = false,
  ...props
}) => {
  const { t } = useTranslation(); // Adjust this to your translation function

  if (hidden) {
    return null;
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MuiDatePicker
            {...field}
            label={label || t(labelKey)}
            renderInput={(params) => <TextField {...params} {...props} />}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default FormDatePicker;
