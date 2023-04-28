// @ts-nocheck
// ** MUI Imports
import { PaletteMode } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { useState, useEffect } from 'react'

// ** Icons Imports
import WeatherNight from 'mdi-material-ui/WeatherNight'
import WeatherSunny from 'mdi-material-ui/WeatherSunny'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'
import { useUserData } from 'src/@core/hooks/useUserData'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const ModeToggler = (props: Props) => {
  const { get, post } = useCustomApiHook()
  const {userId} = useUserData()
  const [mode, setThemeMode] = useState('')

  // ** Props
  const { settings, saveSettings } = props

  const getThemeMode = async () => {
    const singleUserResult = await get(`/users/getSingleUser/${userId}`)
    setThemeMode(singleUserResult?.data?.themeMode)
    saveSettings({ ...settings, mode})
  }

  useEffect(() => {
    userId && getThemeMode();
  }, [userId, mode])



  const handleModeChange = async (mode: PaletteMode) => {
    await post(`/users/changeThemeMode?theme=${mode}&userId=${userId}`)
    saveSettings({ ...settings, mode })
  }

  const handleModeToggle = () => {
    if (settings.mode === 'light') {
      handleModeChange('dark')
    } else {
      handleModeChange('light')
    }
  }

  return (
    <IconButton color='inherit' aria-haspopup='true' onClick={handleModeToggle}>
      {settings.mode === 'dark' ? <WeatherSunny /> : <WeatherNight />}
    </IconButton>
  )
}

export default ModeToggler
