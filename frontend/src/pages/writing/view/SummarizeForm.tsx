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
import Checkbox from '@mui/material/Checkbox'

const SummarizeForm = ({
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
      <Typography style={{ marginBottom: 20 }} variant='h6'>
        Summarize Form
      </Typography>
      <Grid container spacing={10}>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label={t('title_of_copy')}
            inputRef={nameRef}
            required
            helperText={t('title_of_summary')}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            type='text'
            label={t('context')}
            placeholder='This text was from wikipedia'
            helperText={t('context_helper')}
            inputRef={targetAudienceRef}
            required
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            type='text'
            label={t('additional_instructions')}
            placeholder='Make sure to get key points from the summary'
            helperText={t('additional_instructions_helper')}
            inputRef={targetAudienceRef}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type='text'
            label={t('summary_text')}
            placeholder='A flying bottle'
            helperText={t('summary_helper')}
            inputRef={descriptionRef}
            required
            multiline
            rows={8} // Specify the number of rows here
          />
        </Grid>

        <Grid item xs={2}>
          <FormControl component='fieldset'>
            <FormLabel id='demo-row-radio-buttons-group-label' style={{ color: '#C6A7FE' }}>
              {t('summary_length')}
            </FormLabel>
            <RadioGroup
              aria-labelledby='demo-row-radio-buttons-group-label'
              name='row-radio-buttons-group'
              value={selectedLocation}
              onChange={handleLocationChange}
            >
              <FormControlLabel
                value='short'
                control={<Radio />}
                label={<span style={{ width: '80px', display: 'inline-block' }}>Short</span>}
              />
              <FormControlLabel
                value='medium'
                control={<Radio />}
                label={<span style={{ width: '80px', display: 'inline-block' }}>Medium</span>}
              />
              <FormControlLabel
                value='long'
                control={<Radio />}
                label={<span style={{ width: '80px', display: 'inline-block' }}>Long</span>}
              />
              <FormControlLabel
                value='veryLong'
                control={<Radio />}
                label={<span style={{ width: '80px', display: 'inline-block' }}>Very Long</span>}
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={2}>
          <FormControl component='fieldset'>
            <FormLabel id='demo-row-radio-buttons-group-label' style={{ color: '#C6A7FE' }}>
              {t('summary_expertise_level')}
            </FormLabel>
            <RadioGroup
              aria-labelledby='demo-row-radio-buttons-group-label'
              name='row-radio-buttons-group'
              value={selectedLocation}
              onChange={handleLocationChange}
            >
              <FormControlLabel value='none' control={<Radio />} label={<span>None</span>} />
              <FormControlLabel value='little' control={<Radio />} label={<span>Somewhat familiar with text</span>} />
              <FormControlLabel value='normal' control={<Radio />} label={<span>Familiar with text</span>} />
              <FormControlLabel value='expert' control={<Radio />} label={<span>Expert in the text</span>} />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={2}>
          <FormControl component='fieldset'>
            <FormLabel id='demo-row-checkbox-group-label' style={{ color: '#C6A7FE' }}>
              {t('summary_context')}
            </FormLabel>
            <FormControlLabel
              control={
                <Checkbox checked={selectedLocation.includes('technology')} onChange={handleLocationChange} value='technology' />
              }
              label={'Technology'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedLocation.includes('science')}
                  onChange={handleLocationChange}
                  value='science'
                />
              }
              label={'Science'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedLocation.includes('business')}
                  onChange={handleLocationChange}
                  value='business'
                />
              }
              label={'Business'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedLocation.includes('finance')}
                  onChange={handleLocationChange}
                  value='finance'
                />
              }
              label={'Finance'}
            />
          </FormControl>
        </Grid>

        <Grid item xs={2}>
          <FormControl component='fieldset'>
            <FormLabel id='demo-row-checkbox-group-label' style={{ color: '#C6A7FE' }}>
              -
            </FormLabel>
            <FormControlLabel
              control={
                <Checkbox checked={selectedLocation.includes('health')} onChange={handleLocationChange} value='health' />
              }
              label={'Health'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedLocation.includes('politics')}
                  onChange={handleLocationChange}
                  value='politics'
                />
              }
              label={'Politics'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedLocation.includes('sports')}
                  onChange={handleLocationChange}
                  value='sports'
                />
              }
              label={'Sports'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedLocation.includes('entertainment')}
                  onChange={handleLocationChange}
                  value='entertainment'
                />
              }
              label={'Entertainment'}
            />
          </FormControl>
        </Grid>

        <Grid item xs={2}>
          <FormControl component='fieldset'>
            <FormLabel id='demo-row-checkbox-group-label' style={{ color: '#C6A7FE' }}>
              -
            </FormLabel>
            <FormControlLabel
              control={
                <Checkbox checked={selectedLocation.includes('arts')} onChange={handleLocationChange} value='arts' />
              }
              label={'Art and Culture'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedLocation.includes('education')}
                  onChange={handleLocationChange}
                  value='education'
                />
              }
              label={'Education'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedLocation.includes('environment')}
                  onChange={handleLocationChange}
                  value='environment'
                />
              }
              label={'Environment'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedLocation.includes('travel')}
                  onChange={handleLocationChange}
                  value='travel'
                />
              }
              label={'Travel'}
            />
          </FormControl>
        </Grid>

        <Grid item xs={2}>
          <FormControl component='fieldset'>
            <FormLabel id='demo-row-checkbox-group-label' style={{ color: '#C6A7FE' }}>
              -
            </FormLabel>
            <FormControlLabel
              control={
                <Checkbox checked={selectedLocation.includes('history')} onChange={handleLocationChange} value='history' />
              }
              label={'History'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedLocation.includes('socialIssues')}
                  onChange={handleLocationChange}
                  value='socialIssues'
                />
              }
              label={'Social Issues'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedLocation.includes('personalDevelopment')}
                  onChange={handleLocationChange}
                  value='personalDevelopment'
                />
              }
              label={'Personal Development'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedLocation.includes('other')}
                  onChange={handleLocationChange}
                  value='other'
                />
              }
              label={'Other'}
            />
          </FormControl>
        </Grid>

        <Grid item xs={4}>
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
                  label={<span style={{ width: '80px', display: 'inline-block' }}>Facebook</span>}
                />
                <FormControlLabel
                  value='instagram'
                  control={<Radio />}
                  label={<span style={{ width: '80px', display: 'inline-block' }}>Instagram</span>}
                />
                <FormControlLabel
                  value='tiktok'
                  control={<Radio />}
                  label={<span style={{ width: '80px', display: 'inline-block' }}>Tiktok</span>}
                />
                <FormControlLabel
                  value='other'
                  control={<Radio />}
                  label={<span style={{ width: '80px', display: 'inline-block' }}>Other</span>}
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
                  label={<span style={{ width: '80px', display: 'inline-block' }}>Short</span>}
                />
                <FormControlLabel
                  value='medium'
                  control={<Radio />}
                  label={<span style={{ width: '80px', display: 'inline-block' }}>Medium</span>}
                />
                <FormControlLabel
                  value='long'
                  control={<Radio />}
                  label={<span style={{ width: '80px', display: 'inline-block' }}>Long</span>}
                />
                <FormControlLabel
                  value='long'
                  control={<Radio />}
                  label={<span style={{ width: '80px', display: 'inline-block' }}>Random</span>}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default SummarizeForm
