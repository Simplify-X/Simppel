// @ts-nocheck
// ** React Imports
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'

const typeOptions = [
  { value: 'automotive', label: 'Automotive' },
  { value: 'beautyCare', label: 'Beauty and personal care' },
  { value: 'finance', label: 'Finance' },
  { value: 'foodAndBev', label: 'Food and beverage' },
  { value: 'healthCare', label: 'Healthcare' },
  { value: 'homeAndGarden', label: 'Home and garden' },
  { value: 'retail', label: 'Retail' },
  { value: 'technology', label: 'Technology' },
  { value: 'travel', label: 'Travel and hospitality' },
];

const AdvertisementCategorySelector = ({ selectedTypeAd, handleTypeAd }) => {
  return (
    <Grid item xs={12}>
    <FormControl style={{ minWidth: 500 }}>
      <InputLabel>Type of Advertisement</InputLabel>
      <Select label="Type" value={selectedTypeAd} onChange={handleTypeAd}>
        {typeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    </Grid>
  );
};

export default AdvertisementCategorySelector;
