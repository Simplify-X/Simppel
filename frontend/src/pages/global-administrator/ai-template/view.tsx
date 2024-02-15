// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { Grid, Card, CardContent, Typography, Button, CardActionArea, CardActions } from '@mui/material'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { makeStyles } from '@mui/styles'
import Loader from 'src/@core/components/ui/Loader'
import Content from './add'

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
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
  const [handleEditView, setHandleEditView] = useState(false)
  const [currentTemplateId, setCurrentTemplateId] = useState()

  const fetchAiTemplates = async () => {
    const response = await get('/ai-template/admin')
    if (response?.data) {
      setAiTemplates(response.data)
      setLoading(false)
    }
  }

  const handleEdit = async templateId => {
    console.log(templateId)
    setCurrentTemplateId(templateId)
    setHandleEditView(true)
  }

  useEffect(() => {
    fetchAiTemplates()
  }, [])

  const selectedTemplate = aiTemplates.find(template => template.id === currentTemplateId)

  if (loading) {
    return <Loader />
  }

  return (
    <>
      {handleEditView ? (
        <Content loadedData={selectedTemplate} />
      ) : (
        <Grid container spacing={2} mt={5}>
          {aiTemplates.map((template, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={2.4} mt={5}>
              <Card className={classes.card}>
                <CardActionArea>
                  {/* Replace CardMedia with Typography for Emoji */}
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
                <CardActions>
                  <Button size='small' color='primary' onClick={() => handleEdit(template.id)}>
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}
