// @ts-nocheck

'use client';

import React, { useState } from 'react'
import {
  Grid,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  IconButton,
  Box,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import FormField from 'src/@core/components/FormField'
import { useForm } from 'react-hook-form'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Helmet } from 'react-helmet'
import { useTheme } from '@mui/material/styles'
import { EssayBody, OpenAIModel } from 'src/@core/types/types';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  paper: {
    padding: theme.spacing(6),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
    borderRadius: theme.shape.borderRadius * 2
  },
  container: {
    margin: 10
  },
  mainHeader: {
    fontWeight: 'bold',
  },
  selectField: {
    width: '100%'
  },
  generateButton: {
    marginTop: theme.spacing(10)
  },
  copyTextButton: {
    justifyContent: 'flex-end'
  }
}))

export default function EssayGenerator() {
  const classes = useStyles()
  const [generatedEssay] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const [, setLoading] = useState<boolean>(false);
  const [, setOutputCode] = useState<string>('');
  const [model] = useState<OpenAIModel>('gpt-3.5-turbo');
  const theme = useTheme()

  const { control, handleSubmit, errors } = useForm({
    mode: 'onBlur',
    criteriaMode: 'all',
    shouldUnregister: true
  })

  const setSnackbarMessageTool = (message: string, severity: string) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  }

  const submitForm = async (formData) => {

    const {topic, paragraphs, essayType} = formData;

    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    const maxCodeLength = model === 'gpt-3.5-turbo' ? 700 : 700;

    console.log(maxCodeLength);


    const controller = new AbortController();

    const body: EssayBody = {
        topic,
        paragraphs,
        essayType,
        model,
        apiKey,
      };
      
    const response = await fetch('/api/essayAPI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify(body),
    });

    console.log(response);
    if (!response.ok) {
        if (response) {
          setSnackbarMessageTool("Something went wrong went fetching from the API. Make sure to use a valid API key.", "error")
        }

        return;
      }

      const data = response.body;
      console.log(data);

      if (!data) {
        setLoading(false);
        setSnackbarMessageTool("Something went wrong", "error")
        
        return;
      }
  
      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let code = '';
  
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        console.log(chunkValue);
  
        code += chunkValue;
        console.log(code);
  
        setOutputCode((prevCode) => prevCode + chunkValue);
      }

  }


  function handleSnackbarClose() {
    setOpenSnackbar(false)
  }

  const handleCopy = () => {
    const textToCopy = navigator.clipboard.writeText(generatedEssay)
    if (!textToCopy) {
        setSnackbarMessageTool("There is no text to copy", "error")

        return;
    }
    setSnackbarMessageTool("Copied AI response successfully", "success")
  }

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Helmet>
        <title>Simppel - Essay AI Generation</title>
      </Helmet>

      <Typography
        variant='h4'
        id='h1-header'
        sx={{
          color: theme.palette.primary.main,
          marginBottom: 10,
          fontWeight: 'bold',
          '@media (min-width:1440px)': {
            maxWidth: '1200px',
            marginRight: 'auto'
          }
        }}
      >
        Essay Generator
      </Typography>

      <Grid container spacing={10} alignItems='stretch'>
        <Grid item xs={12} md={4}>
          <Paper className={classes.paper}>
            <Typography variant='h4' gutterBottom align='left' className={classes.mainHeader}>
              Essay Topic
            </Typography>
            <Typography variant='subtitle1' display='block' align='left' gutterBottom>
              What your essay will be about?
            </Typography>
            <FormField
              as={TextField}
              name='topic'
              defaultValue=''
              control={control}
              placeholder='Type here your content..'
              margin='normal'
              errors={errors}
              fullWidth
              multiline
              rows={12}
            />

            <FormControl component='fieldset' variant='outlined' style={{ width: '100%', marginTop: 25 }}>
              <InputLabel id='config-type'>Number of paragraphs</InputLabel>
              <FormField
                as={Select}
                name='paragraphs'
                control={control}
                errors={errors}
                label='Number of paragraphs'
                className={classes.selectField}
                margin='normal'
                required
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
              </FormField>
            </FormControl>

            <FormControl component='fieldset' variant='outlined' style={{ width: '100%', marginTop: 25 }}>
              <InputLabel id='config-type'>Select your Essay type</InputLabel>
              <FormField
                as={Select}
                name='essayType'
                control={control}
                errors={errors}
                labelId='config-type'
                aria-label='Select your Essay type'
                label='Select your Essay type'
                className={classes.selectField}
                margin='normal'
                required
              >
                <MenuItem value={'Argumentative'}>Argumentative</MenuItem>
                <MenuItem value={'Persuasive'}>Persuasive</MenuItem>
                <MenuItem value={'Classic'}>Classic</MenuItem>
                <MenuItem value={'Memoir'}>Memoir</MenuItem>
                <MenuItem value={'Critique'}>Critique</MenuItem>
                <MenuItem value={'Compare/Contrast'}>Compare/Contrast</MenuItem>
              </FormField>
            </FormControl>
            <Button variant='contained' type='submit' size='large' fullWidth color='primary' className={classes.generateButton}>
              Generate your Essay
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper className={classes.paper}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <Box>
                <Typography variant='h4' gutterBottom align='left' className={classes.mainHeader}>
                  AI Output
                </Typography>
                <Typography variant='subtitle1' display='block' align='left' gutterBottom>
                  Enjoy your outstanding essay!
                </Typography>
              </Box>
              <Tooltip title='Copy AI Output'>
                <IconButton onClick={handleCopy}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <FormField
              as={TextField}
              name='description'
              defaultValue=''
              control={control}
              placeholder='Your generated response will appear here...'
              margin='normal'
              errors={errors}
              fullWidth
              multiline
              disabled
              rows={21}
            />
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </form>
  )
}
