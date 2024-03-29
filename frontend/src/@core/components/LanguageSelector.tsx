// @ts-nocheck
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Flag from 'react-world-flags'
import { useTranslation } from 'react-i18next'

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
            renderValue={value => {
              const selectedOption = languageOptions.find(option => option.value === value);

              return (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Flag code={value} height={16} />
                  {/* Use the label from the found option */}
                  <span style={{ marginLeft: 10 }}>{selectedOption ? selectedOption.label : ''}</span>
                </div>
              );
            }}
            
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
    </>
  )
}

export default LanguageSelector
