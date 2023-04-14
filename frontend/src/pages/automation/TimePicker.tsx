// @ts-nocheck
import { useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { useTranslation } from 'react-i18next'

const TimePickerField = ({ onChange }) => {
  const { t } = useTranslation()
  const [selectedTime, setSelectedTime] = useState(null)

  const handleTimeChange = time => {
    setSelectedTime(time)
    onChange(time) // Pass the selected date to the parent component via the onChange prop
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker label={t('automation_time')} value={selectedTime} onChange={handleTimeChange} />
    </LocalizationProvider>
  )
}

export default TimePickerField
