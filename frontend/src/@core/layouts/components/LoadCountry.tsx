import React, { useState, useEffect } from 'react'
import { FormControl, TextField, Box, Autocomplete } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'

type Country = {
  name: {
    common: string
  }
  capital: string
  region: string
}

interface Props {
  handleChange: any
}

const countriesUrl = 'https://restcountries.com/v3.1/all'

const SearchCountry: React.FC<Props> = ({ handleChange }) => {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [searchTerm] = useState<string>('')

  useEffect(() => {
    setLoading(true)
    const fetchCountries = async () => {
      const response = await fetch(countriesUrl)
      const data = await response.json()
      setCountries(data)
      setLoading(false)
    }
    fetchCountries()
  }, [])

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <p>Loading country name...</p>
        <LinearProgress />
      </Box>
    )
  }

  const filteredCountries = countries.filter(country =>
    country.name?.common.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const options = filteredCountries?.map((country: Country) => ({
    label: country.name.common,
    value: country.name.common
  }))

  return (
    <FormControl fullWidth variant='outlined'>
      {/* <InputLabel id='country'>Select Country</InputLabel>
      <Select sx={{ marginBottom: 4 }} labelId='country' label='Select Country' id='country' onChange={handleChange}>
        <TextField value={searchTerm} sx={{ padding: 4 }} onChange={e => setSearchTerm(e.target.value)} />

        {filteredCountries?.map((country: Country) => (
          <MenuItem key={country.name.common} value={country?.name.common}>
            {country?.name.common}
          </MenuItem>
        ))}
      </Select> */}
      <Autocomplete
        onChange={(e, newValue) => {
          handleChange(newValue?.value)
        }}
        options={options}
        autoHighlight
        getOptionLabel={option => option.label}
        renderOption={(props, option) => <li {...props}>{option.label}</li>}
        renderInput={params => <TextField {...params} label='Select Country' variant='outlined' />}
      />
    </FormControl>
  )
}

export default SearchCountry
