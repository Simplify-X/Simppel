// @ts-nocheck
import { useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button, { ButtonProps } from '@mui/material/Button'
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
import { styled } from '@mui/material/styles'
import LanguageSelector from '../../content/LanguageSelector'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'

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

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
  }
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const AdditionalFeatures = ({
  selectedLanguage,
  handleLanguageChange,
  nameRef,
  selectedMood,
  handleMood,
  personName,
  handleChange,
  data
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')

  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()
    const files = event.target.files
    if (files && files.length !== 0) {
      const newImages = []
      for (let i = 0; i < files.length; i++) {
        reader.onload = () => {
          newImages.push(reader.result as string)
          if (newImages.length === files.length) {
            setImgSrc(newImages)
          }
        }
        reader.readAsDataURL(files[i])
      }
    }
  }

  return (
    <>
      <Card style={{ marginTop: '20px', padding: 15 }}>
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
                inputRef={nameRef}
                required
                helperText={t('branding_name_helper_text')}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                label={t('branding_description')}
                inputRef={nameRef}
                required
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
                  label={"Custom Command"}
                  placeholder={'Include all references from this material'}
                  inputRef={nameRef}
                  required
                  helperText={t('custom_command')}
                />
              )}
            </Grid>
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
          </Grid>
        </CardContent>
      </Card>

      {data.imageUploadFeatureEnabled && (
        <Card style={{ marginTop: '20px' }}>
          <CardHeader title={t('images')} titleTypographyProps={{ variant: 'h6' }} />
          <CardContent>
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled src={imgSrc} alt='Profile Pic' />
                <Box>
                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    Upload New Photo
                    <input
                      hidden
                      type='file'
                      onChange={onChange}
                      accept='image/png, image/jpeg'
                      id='account-settings-upload-image'
                      multiple
                    />
                  </ButtonStyled>
                  <ResetButtonStyled
                    color='error'
                    variant='outlined'
                    onClick={() => setImgSrc('/images/avatars/1.png')}
                  >
                    Reset
                  </ResetButtonStyled>
                  <Typography variant='body2' sx={{ marginTop: 5 }}>
                    Allowed PNG or JPEG. Max size of 800K.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default AdditionalFeatures
