// @ts-nocheck
import  { useState} from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslation } from 'react-i18next';

const DatePickerField = ({ onChange }) => {
  const {t} = useTranslation();
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onChange(date); // Pass the selected date to the parent component via the onChange prop
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={t('automation_date')}
        value={selectedDate}
        onChange={handleDateChange}
      />
    </LocalizationProvider>
  );
};

export default DatePickerField;
