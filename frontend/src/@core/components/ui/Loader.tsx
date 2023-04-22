import { Box, CircularProgress } from '@mui/material'
import { FC } from 'react'
import { ThemeColor } from 'src/@core/layouts/types'

interface LoaderProps {
  isLaoding?: boolean
  text?: string
  color?: ThemeColor
}

const Loader: FC<LoaderProps> = ({color="primary"}) => {
  return (
    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 30 }}>
      <CircularProgress color={color} size={50} />
    </Box>
  )
}

export default Loader;
