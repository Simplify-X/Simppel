// @ts-nocheck
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import TranslateIcon from '@mui/icons-material/Translate'

import { useTranslation } from 'react-i18next';
import en from '../../../locales/en/common';
import de from '../../../locales/de/common';
import bg from '../../../locales/bg/common';
import i18n from '../../../i18n'; //@ts-ignore
import { API_BASE_URL } from 'src/config'
import * as Sentry from '@sentry/nextjs'
import Cookies from 'js-cookie'

function LanguageDropdown() {
  const { i18n } = useTranslation();
  const [accountId, setAccountId] = useState(null)

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      window.location.replace('/login')

      return
    }

    fetch(`${API_BASE_URL}/users/my`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('Invalid token')
        }
      })
      .then(data => {
        setAccountId(data)
      })
      .catch(error => {
        Sentry.captureException(error)
        window.location.replace('/login')
      })
  }, [])

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      window.location.replace('/login')

      return
    }
  
    fetch(`${API_BASE_URL}/users/my`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('Invalid token')
        }
      })
      .then(data => {
        setAccountId(data)

        fetch(`${API_BASE_URL}/users/getSingleUser/${data}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(response => {
            if (response.ok) {
              return response.json()
            } else {
              throw new Error('Unable to retrieve language preference')
            }
          })
          .then(data => {
            const savedLanguage = data.defaultLanguage
            if (savedLanguage && i18n.language !== savedLanguage) {
              i18n.changeLanguage(savedLanguage)
              localStorage.setItem('language', savedLanguage)
            }
          })
          .catch(error => {
            Sentry.captureException(error)
          })
      })
      .catch(error => {
        Sentry.captureException(error)
        window.location.replace('/login')
      })
  }, [i18n]);
  

  const handleChange = (event) => {
    const locale = event.target.value;
    i18n.changeLanguage(locale);
    localStorage.setItem('language', locale);

    
    // Make a network request to update the user's language preference in the database
    fetch(`${API_BASE_URL}/users/updateLanguagePreference?locale=${locale}&accountId=${accountId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      // Handle response
      console.log(response);
    })
    .catch(error => {
      // Handle error
      Sentry.captureException(error);
    });
  };
  

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <TranslateIcon sx={{ mr: 1 }} />
      <FormControl variant='standard' sx={{ minWidth: 80 }}>
        <Select
          value={i18n.language}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Language' }}
        >
          <MenuItem value='en'>{en.languageName}</MenuItem>
          <MenuItem value='de'>{de.languageName}</MenuItem>
          <MenuItem value='bg'>{bg.languageName}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}


export default LanguageDropdown
