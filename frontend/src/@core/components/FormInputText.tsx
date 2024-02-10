
// @ts-nocheck
import React from 'react';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next'

const FormInputText = ({
  name,
  control,
  defaultValue,
  label,
  labelKey,
  hidden = false,
  variant = "outlined",
  margin = "normal",
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
        <TextField
          {...field}
          variant={variant}
          margin={margin}
          fullWidth
          label={label || t(labelKey)}
          {...props}
        />
      )}
    />
  );
};

export default FormInputText;


