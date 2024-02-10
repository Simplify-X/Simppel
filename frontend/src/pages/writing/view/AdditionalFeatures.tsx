// @ts-nocheck
import { useState } from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import 'react-toastify/dist/ReactToastify.css'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import OutlinedInput from '@mui/material/OutlinedInput'
import { Theme, useTheme } from '@mui/material/styles'
import LanguageSelector from '../../../@core/components/LanguageSelector'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import SelectChangeEvent from '@mui/material/Select'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

const names = ['Physical Product', 'Digital Product']

const AdditionalFeatures = ({
  selectedLanguage,
  handleLanguageChange,
  brandName,
  brandDescription,
  customCommandRef,
  selectedMood,
  handleMood,
  selectedValue,
  selectedCopyType,
  handleCopyType,
  data
}) => {
  const { t } = useTranslation()
  const theme = useTheme()

  const [isChecked, setIsChecked] = useState(false)
  const [personName, setPersonName] = useState<string[]>([])

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value }
    } = event
    setPersonName(typeof value === 'string' ? value.split(',') : value)
  }

  function getStyles(name: string, personName: readonly string[] | undefined, theme: Theme) {
    return {
      fontWeight:
        personName && personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium
    }
  }

  return (
    <>
      <CardHeader title={t('additional_features')} titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <Grid container spacing={5}>
          <LanguageSelector selectedLanguage={selectedLanguage} onChange={handleLanguageChange} />
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={t('branding_name')}
              inputRef={brandName}
              value={data?.defaultBrandName}
              helperText={t('branding_name_helper_text')}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label={t('branding_description')}
              inputRef={brandDescription}
              value={data?.defaultBrandName}
              helperText={t('enter_product_name')}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={4}>
            <Grid item xs={4}>
              <label htmlFor='custom-checkbox'>Custom Input</label>
            </Grid>
            <FormControlLabel
              control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
              label='Custom Commands'
            />
          </Grid>
          <Grid item xs={4}>
            {isChecked && (
              <TextField
                fullWidth
                label={'Custom Command'}
                placeholder={'Include all references from this material'}
                inputRef={customCommandRef}
                required
                helperText={t('custom_command')}
              />
            )}
          </Grid>
          {selectedValue === 'create' && (
            <Grid item xs={12}>
              <FormControl>
                <FormLabel id='demo-row-radio-buttons-group-label'>Copy Writing Type</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby='demo-row-radio-buttons-group-label'
                  name='row-radio-buttons-group'
                  value={selectedCopyType}
                  onChange={handleCopyType}
                >
                  <FormControlLabel value='WEBSITE_COPY' control={<Radio />} label='Website' />
                  <FormControlLabel value='SEO_COPY' control={<Radio />} label='SEO' />
                  <FormControlLabel value='B2B_COPY' control={<Radio />} label='B2B' />
                  <FormControlLabel value='B2C_COPY' control={<Radio />} label='B2C' />
                  <FormControlLabel value='DIRECT_COPY' control={<Radio />} label='Direct' />
                  <FormControlLabel value='AD_COPY' control={<Radio />} label='Ad' />
                  <FormControlLabel value='SOCIAL_MEDIA_COPY' control={<Radio />} label='Social Media' />
                </RadioGroup>
              </FormControl>
            </Grid>
          )}
          {selectedValue !== 'create' && selectedValue !== 'summarize' && selectedValue !== 'email' && (
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>{t('advanced_settings')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid item xs={12}>
                    <FormControl>
                      <FormLabel id='demo-row-radio-buttons-group-label'>Mood</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby='demo-row-radio-buttons-group-label'
                        name='row-radio-buttons-group'
                        value={selectedMood}
                        onChange={handleMood}
                      >
                        <FormControlLabel value='sell' control={<Radio />} label='Sell' />
                        <FormControlLabel value='promote' control={<Radio />} label='Promote' />
                        <FormControlLabel value='engage' control={<Radio />} label='Engage' />
                        <FormControlLabel value='traffic' control={<Radio />} label='Traffic' />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} style={{ marginTop: '20px' }}>
                    <FormControl sx={{ minWidth: 500 }}>
                      <InputLabel id='demo-multiple-chip-label'>{t('product_type')}</InputLabel>
                      <Select
                        labelId='demo-multiple-chip-label'
                        id='demo-multiple-chip'
                        multiple
                        value={personName}
                        onChange={handleChange}
                        input={<OutlinedInput id='select-multiple-chip' label='Chip' />}
                        renderValue={selected => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map(value => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                      >
                        {names.map(name => (
                          <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </>
  )
}

export default AdditionalFeatures
