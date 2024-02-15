  // @ts-nocheck
import React, { useState, useEffect } from 'react'
import { Grid, Card, CardContent, Typography, CardActionArea } from '@mui/material'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { makeStyles } from '@mui/styles'
import Loader from 'src/@core/components/ui/Loader'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%'
    }
  },
  emoji: {
    fontSize: '2rem',
    marginBottom: '1rem'
  }
}))

export default function MultiActionAreaCards() {
  const { get } = useCustomApiHook()
  const [loading, setLoading] = useState(true)
  const [aiTemplates, setAiTemplates] = useState([])
  const classes = useStyles()
  const theme = useTheme()
  const router = useRouter()

  const fetchAiTemplates = async () => {
    const response = await get('/ai-template/admin')
    if (response?.data) {
      setAiTemplates(response.data)
      setLoading(false)
    }
  }

  const handleNavigation = (tempalteType: string) => {
    router.push(`/ai-template/${tempalteType}`);
  }

  useEffect(() => {
    fetchAiTemplates()
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <Typography
        variant='h4'
        id='h1-header'
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 'bold',
          '@media (min-width:1440px)': {
            maxWidth: '1200px',
            marginRight: 'auto'
          }
        }}
      >
        AI Templates
      </Typography>
      <Grid container spacing={2} mt={5}>
        {aiTemplates.map((template, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={2.4} mt={5} alignItems='stretch'>
            <Card className={classes.card}>
              <CardActionArea onClick={() => handleNavigation(template.templateType)}>
                <CardContent>
                  <Typography className={classes.emoji} component='div'>
                    {template.emoji || '🚀'} {/* Default emoji if none provided */}
                  </Typography>
                  <Typography gutterBottom variant='h5' component='div'>
                    {template.templateName}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {template.templateDescription}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}
