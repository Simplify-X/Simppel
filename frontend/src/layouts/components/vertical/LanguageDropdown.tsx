// @ts-nocheck
import React, { useEffect } from 'react'
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

function LanguageDropdown() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  const handleChange = (event) => {
    const locale = event.target.value;
    i18n.changeLanguage(locale);
    localStorage.setItem('language', locale);
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
