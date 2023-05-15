// @ts-nocheck
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import 'react-toastify/dist/ReactToastify.css'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import CustomInputChip from '../CustomInputChip'
import Divider from '@mui/material/Divider'

const CopyForm = ({
  handleLocationChange,
  selectedLocation,
  selectedTextLength,
  handleTextLength,
  nameRef,
  targetAudienceRef,
  descriptionRef
}) => {
  const { t } = useTranslation()

  return (
    <>
      <Typography style={{ marginBottom: 20, color: '#C6A7FE' }} variant='h6'>
        Copy writing data
      </Typography>
      <Grid container spacing={10}>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label={t('title_of_copy')}
            inputRef={nameRef}
            required
            helperText={t('title_helper_text')}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            type='text'
            label={t('target_audience')}
            placeholder='Gym Rats, Soccer Moms, etc.'
            helperText={t('target_audience_helper_text')}
            inputRef={targetAudienceRef}
            required
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputChip />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type='text'
            label={t('description_copy')}
            placeholder='A flying bottle'
            helperText={t('product_description_helper_text')}
            inputRef={descriptionRef}
            required
            multiline
            rows={8} // Specify the number of rows here
          />
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={4}>
          <Typography style={{ marginBottom: 20, color: '#C6A7FE' }} variant='h6'>
            Copy Settings
          </Typography>
          <Grid item xs={12}>
            <FormControl component='fieldset'>
              <FormLabel id='demo-row-radio-buttons-group-label' style={{ color: '#C6A7FE' }}>
                {t('tone')}
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby='demo-row-radio-buttons-group-label'
                name='row-radio-buttons-group'
                value={selectedLocation}
                onChange={handleLocationChange}
              >
                <FormControlLabel
                  value='formal'
                  control={<Radio />}
                  label={<span style={{ width: '100px', display: 'inline-block' }}>Formal</span>}
                />
                <FormControlLabel
                  value='informal'
                  control={<Radio />}
                  label={<span style={{ width: '100px', display: 'inline-block' }}>Informal</span>}
                />
                <FormControlLabel
                  value='humorous'
                  control={<Radio />}
                  label={<span style={{ width: '100px', display: 'inline-block' }}>Humorous</span>}
                />
                <FormControlLabel
                  value='serious'
                  control={<Radio />}
                  label={<span style={{ width: '100px', display: 'inline-block' }}>Serious</span>}
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} style={{ marginTop: '17px' }}>
            <FormControl component='fieldset'>
              <FormLabel id='demo-row-radio-buttons-group-label' style={{ color: '#C6A7FE' }}>
                {t('advertisement_location')}
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby='demo-row-radio-buttons-group-label'
                name='row-radio-buttons-group'
                value={selectedLocation}
                onChange={handleLocationChange}
              >
                <FormControlLabel
                  value='facebook'
                  control={<Radio />}
                  label={<span style={{ width: '100px', display: 'inline-block' }}>Facebook</span>}
                />
                <FormControlLabel
                  value='instagram'
                  control={<Radio />}
                  label={<span style={{ width: '100px', display: 'inline-block' }}>Instagram</span>}
                />
                <FormControlLabel
                  value='tiktok'
                  control={<Radio />}
                  label={<span style={{ width: '100px', display: 'inline-block' }}>Tiktok</span>}
                />
                <FormControlLabel
                  value='other'
                  control={<Radio />}
                  label={<span style={{ width: '100px', display: 'inline-block' }}>Other</span>}
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} style={{ marginTop: '17px' }}>
            <FormControl component='fieldset'>
              <FormLabel id='demo-row-radio-buttons-group-label' style={{ color: '#C6A7FE' }}>
                {t('advertisement_length')}
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby='demo-row-radio-buttons-group-label'
                name='row-radio-buttons-group'
                value={selectedTextLength}
                onChange={handleTextLength}
              >
                <FormControlLabel
                  value='short'
                  control={<Radio />}
                  label={<span style={{ width: '100px', display: 'inline-block' }}>Short</span>}
                />
                <FormControlLabel
                  value='medium'
                  control={<Radio />}
                  label={<span style={{ width: '100px', display: 'inline-block' }}>Medium</span>}
                />
                <FormControlLabel
                  value='long'
                  control={<Radio />}
                  label={<span style={{ width: '100px', display: 'inline-block' }}>Long</span>}
                />
                <FormControlLabel
                  value='long'
                  control={<Radio />}
                  label={<span style={{ width: '100px', display: 'inline-block' }}>Random</span>}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default CopyForm
