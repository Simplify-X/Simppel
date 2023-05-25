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
  descriptionRef,
  handleCheckboxChange,
  selectedChecbox
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
              value={selectedTextLength}
              onChange={handleTextLength}
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
                <Checkbox checked={selectedChecbox?.includes('technology')} onChange={handleCheckboxChange} value='technology' />
              }
              label={'Technology'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedChecbox?.includes('science')}
                  onChange={handleCheckboxChange}
                  value='science'
                />
              }
              label={'Science'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedChecbox?.includes('business')}
                  onChange={handleCheckboxChange}
                  value='business'
                />
              }
              label={'Business'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedChecbox?.includes('finance')}
                  onChange={handleCheckboxChange}
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
                <Checkbox checked={selectedChecbox?.includes('health')} onChange={handleCheckboxChange} value='health' />
              }
              label={'Health'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedChecbox?.includes('politics')}
                  onChange={handleCheckboxChange}
                  value='politics'
                />
              }
              label={'Politics'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedChecbox?.includes('sports')}
                  onChange={handleCheckboxChange}
                  value='sports'
                />
              }
              label={'Sports'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedChecbox?.includes('entertainment')}
                  onChange={handleCheckboxChange}
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
                <Checkbox checked={selectedChecbox?.includes('arts')} onChange={handleCheckboxChange} value='arts' />
              }
              label={'Art and Culture'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedChecbox?.includes('education')}
                  onChange={handleCheckboxChange}
                  value='education'
                />
              }
              label={'Education'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedChecbox?.includes('environment')}
                  onChange={handleCheckboxChange}
                  value='environment'
                />
              }
              label={'Environment'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedChecbox?.includes('travel')}
                  onChange={handleCheckboxChange}
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
                <Checkbox checked={selectedChecbox?.includes('history')} onChange={handleCheckboxChange} value='history' />
              }
              label={'History'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedChecbox?.includes('socialIssues')}
                  onChange={handleCheckboxChange}
                  value='socialIssues'
                />
              }
              label={'Social Issues'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedChecbox?.includes('personalDevelopment')}
                  onChange={handleCheckboxChange}
                  value='personalDevelopment'
                />
              }
              label={'Personal Development'}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedChecbox?.includes('other')}
                  onChange={handleCheckboxChange}
                  value='other'
                />
              }
              label={'Other'}
            />
          </FormControl>
        </Grid>
      </Grid>
    </>
  )
}

export default SummarizeForm
