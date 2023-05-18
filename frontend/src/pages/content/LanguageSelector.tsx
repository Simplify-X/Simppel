// @ts-nocheck
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Flag from 'react-world-flags'
import { useTranslation } from 'react-i18next'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

const languageOptions = [
  { value: 'us', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'bg', label: 'Bulgarian' },
  { value: 'it', label: 'Italian' },
  { value: 'es', label: 'Spanish' },
  { value: 'de', label: 'German' }
]

const LanguageSelector = ({ selectedLanguage, onChange }) => {
  const { t } = useTranslation()

  return (
    <>
      <Grid item xs={4}>
        <FormControl style={{ minWidth: 370 }}>
          <InputLabel>{t('language_text')}</InputLabel>
          <Select
            label='Language'
            value={selectedLanguage}
            onChange={onChange}
            displayEmpty
            renderValue={value => (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Flag code={value} height={16} />
                <span style={{ marginLeft: 10 }}>{value}</span>
              </div>
            )}
          >
            {languageOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Flag code={option.value} height={16} />
                  <span style={{ marginLeft: 10 }}>{option.label}</span>
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <FormControlLabel value='start' control={<Switch color='primary' />} label='Text in English' labelPlacement='start' />
      </Grid>
    </>
  )
}

export default LanguageSelector
