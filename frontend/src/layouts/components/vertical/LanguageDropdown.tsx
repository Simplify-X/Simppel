// @ts-nocheck
import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import TranslateIcon from '@mui/icons-material/Translate'

import en from '../../../locales/en/common';
import de from '../../../locales/de/common';
import bg from '../../../locales/bg/common';
import i18n from '../../../i18n'; //@ts-ignore
import * as Sentry from '@sentry/nextjs'
import { useUserData } from 'src/@core/hooks/useUserData'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'

function LanguageDropdown() {

  const { userId, token } = useUserData()
  const { response, error, get, post } = useCustomApiHook()

  // console.log(userId);

  useEffect(() => {
    if (userId && token) {
      handleGetSignleUser()
    }
  }, [i18n, userId, token])

  const handleGetSignleUser = async () => {
    const res = await get(`/users/getSingleUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (res?.data) {
      const savedLanguage = res.data?.defaultLanguage
        if (savedLanguage && i18n.language !== savedLanguage) {
          i18n?.changeLanguage(savedLanguage)
          localStorage.setItem('language', savedLanguage)
        }
    }
  }

  useEffect(() => {
    error && Sentry.captureException(error)
  }, [response, error])
  

  const handleChange = async (event) => {
    const locale = event.target.value;
    i18n?.changeLanguage(locale);
    localStorage.setItem('language', locale);

    // Make a network request to update the user's language preference in the database
    await post(`/users/updateLanguagePreference?locale=${locale}&userId=${userId}`)
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <TranslateIcon sx={{ mr: 1 }} />
      <FormControl variant='standard' sx={{ minWidth: 80 }}>
        <Select value={i18n.language} onChange={handleChange} displayEmpty inputProps={{ 'aria-label': 'Language' }}>
          <MenuItem value='en'>{en.languageName}</MenuItem>
          <MenuItem value='de'>{de.languageName}</MenuItem>
          <MenuItem value='bg'>{bg.languageName}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default LanguageDropdown
