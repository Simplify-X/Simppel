// @ts-nocheck
import * as React from 'react'
import authRoute from 'src/@core/utils/auth-route'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import 'react-toastify/dist/ReactToastify.css'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import * as Sentry from '@sentry/nextjs'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogContentText,
  LinearProgress,
  CircularProgress,
  Menu,
  MenuItem
} from '@mui/material'
import { API_BASE_URL } from 'src/config'
import TextField from '@mui/material/TextField'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import SaveIcon from '@mui/icons-material/Save'
import ClearIcon from '@mui/icons-material/Clear'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Snackbar } from '@mui/material'
import { Alert } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useUserData } from 'src/@core/hooks/useUserData'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { Modal } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Loader from 'src/@core/components/ui/Loader'
import CardActions from '@mui/material/CardActions'
import ImageGallery from 'src/@core/components/ImageGallery'
import QRCode from 'qrcode.react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DynamicQRGenertation from '../create'

const StyledDialogContentText = styled(DialogContentText)`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  overflow: hidden;
`

const SingleContent = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const [showAd, setAd] = useState(false)
  const [newd, setNewData] = useState([])
  const [updated] = useState(false)
  const [isLoading] = useState(false)
  const [role, setRole] = useState([])
  const router = useRouter()
  const { id } = router.query
  const [editMode, setEditMode] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const { accountId } = useUserData()
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const { get, post } = useCustomApiHook()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [groupLoading, setGroupLoading] = useState(true)
  const [groupMember, setGroupMemberData] = useState()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [handleEditView, setHandleEditView] = useState(false)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const handleSend = async () => {
    try {
      const res = await get(`/groups/${accountId}`)
      setRole(res?.data)
      setModalOpen(true)
    } catch (error) {
      // Handle error
    }
  }

  function handleSnackbarClose() {
    setOpenSnackbar(false)
  }

  useEffect(() => {
    const imageUrls = [
      'https://picsum.photos/seed/image1/800/400',
      'https://picsum.photos/seed/image2/800/400',
      'https://picsum.photos/seed/image3/800/400',
      'https://picsum.photos/seed/image4/800/400',
      'https://picsum.photos/seed/image5/800/400'
    ]

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * imageUrls.length)
      setImageUrl(imageUrls[randomIndex])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const toggleEditMode = () => {
    setEditMode(!editMode)
  }

  const handleTitleChange = e => {
    setNewData({ ...newd, title: e.target.value })
  }

  const handleDescriptionChange = e => {
    setNewData({ ...newd, description: e.target.value })
  }

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/qr-code/single/${id}`)
        .then(response => response.json())
        .then(data => {
          setData(data)
          setLoading(true)
        })
        .catch(error => {
          Sentry.captureException(error)
        })
    }
  }, [id])

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/advertisement/result/${id}`)
        const fetchedData = await response.json()
        setNewData(fetchedData)
        setAd(true)
      } catch (error) {
        setAd(false)
        Sentry.captureException(error)
      }
    }

    fetchRequest()
  }, [id, updated])

  const handleGeneratedAdvertisementEdit = async () => {
    console.log('updating text')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(newd?.description)
    setSnackbarMessage('Copied Successfully')
    setSnackbarSeverity('success')
    setOpenSnackbar(true)
  }

  useEffect(() => {
    accountId && fecthGroupData()
  }, [accountId])

  useEffect(() => {
    role && fetchGroupMemberData()
  }, [role])

  const fecthGroupData = async () => {
    const res = await get(`/groups/${accountId}`)
    setRole(res?.data)
    setGroupLoading(false)
  }

  const fetchGroupMemberData = async () => {
    const responses = await Promise.all(
      role.map(async roleItem => {
        try {
          const res = await get(`/groups/members/${roleItem.id}`)

          return res?.data
        } catch (error) {
          console.error(`Error fetching data for role ${roleItem.id}: `, error)

          return null // or some other value to signify error
        }
      })
    )

    // filter out nulls (if any) and flatten the array
    const filteredAndFlattenedResponses = responses.reduce((acc, curr) => {
      if (curr !== null) {
        return [...acc, ...curr]
      }

      return acc
    }, [])

    setGroupMemberData(filteredAndFlattenedResponses)
  }

  async function sendAdvertisement(selectedGroupId) {
    const advData = {
      name: data?.name,
      description: data?.description,
      targetAudience: data?.targetAudience,
      advertisementLocation: data?.advertisementLocation,
      advertisementType: data?.advertisementType,
      advertisementMood: data?.advertisementMood,
      advertisementLength: data?.advertisementLength,
      languageText: data?.languageText,
      brandName: data?.brandName,
      brandDescription: data?.brandDescription
    }

    await post(`/advertisements/${selectedGroupId}`, advData)
  }

  const handleEdit = async () => {
    setHandleEditView(true)
  }

  if (groupLoading) {
    return <Loader />
  }

  return (
    <>
      <Helmet>
        <title>View Advertisement</title>
      </Helmet>
      {handleEditView ? (
        <DynamicQRGenertation loadedData={data}/>
      ) : (
        <Grid container spacing={10}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardHeader
                title='QR Code'
                titleTypographyProps={{ variant: 'h6' }}
                action={
                  <>
                    <IconButton onClick={handleClick}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id='simple-menu'
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem
                        onClick={() => {
                          handleEdit()
                          handleClose()
                        }}
                      >
                        Edit
                      </MenuItem>
                    </Menu>
                  </>
                }
              />

              <Divider />
              <CardContent>
                {!loading ? (
                  <Typography variant='body1'>{t('loading')}</Typography>
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant='h6'>Main Data</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='caption'>{t('product_name')}</Typography>
                      <Typography variant='body1'>{data.name ? data.name : '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='caption'>{t('product_description')}</Typography>
                      <Typography variant='body1'>{data.description ? data.description : '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='caption'>{t('discount')}</Typography>
                      <Typography variant='body1'>{data.price ? data.price : '-'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant='h6'>Other</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='caption'>{t('client_email')}</Typography>
                      <Typography variant='body1'>{data.clientEmail ? data.clientEmail : '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='caption'>{t('client_phone')}</Typography>
                      <Typography variant='body1'>{data.clientPhone ? data.clientPhone : '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='caption'>{t('client_website')}</Typography>
                      {data.clientWebsite ? (
                        <Typography variant='body1'>
                          <a href={data.clientWebsite} target='_blank' rel='noopener noreferrer'>
                            {data.clientWebsite}
                          </a>
                        </Typography>
                      ) : (
                        <Typography variant='body1'>-</Typography>
                      )}
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant='caption'>{t('industry')}</Typography>
                      <Typography variant='body1'>{data.industry ? data.industry : '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='caption'>{t('location')}</Typography>
                      <Typography variant='body1'>{data.location ? data.location : '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='caption'>{t('status')}</Typography>
                      <Typography variant='body1'>{data.status ? data.status : '-'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant='h6'>QR Code</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      {loading && data.id && (
                        <QRCode value={`${window.location.origin}/qr-code/view/qr2/${data.id}`} size={200} />
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant='h6'>Attachments</Typography>
                    </Grid>
                    <ImageGallery advertisementId={id} />
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
          {showAd && (
            <Grid item xs={12} sm={6}>
              <Card>
                <CardHeader
                  title='AI Generated Advertisements'
                  titleTypographyProps={{ variant: 'h6' }}
                  action={
                    <>
                      {editMode && (
                        <Tooltip title='Click to save generated advertisement'>
                          <IconButton onClick={handleGeneratedAdvertisementEdit}>
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                      )}

                      <Tooltip title={editMode ? 'Click to cancel editing' : 'Click to edit generated advertisement'}>
                        <IconButton onClick={toggleEditMode}>{editMode ? <ClearIcon /> : <EditIcon />}</IconButton>
                      </Tooltip>

                      <IconButton onClick={handleCopy}>
                        <ContentCopyIcon />
                      </IconButton>
                    </>
                  }
                />
                <Divider />
                <CardContent>
                  {!loading ? (
                    <CircularProgress />
                  ) : (
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        {editMode ? (
                          <TextField variant='outlined' fullWidth value={newd?.title} onChange={handleTitleChange} />
                        ) : (
                          <div>
                            <Typography variant='caption'>Advertisement Title</Typography>
                            <Typography variant='body1'>{newd?.title}</Typography>
                          </div>
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='caption'>{t('advertisement_description')}</Typography>
                        {editMode ? (
                          <TextField
                            variant='outlined'
                            fullWidth
                            multiline
                            rows={4}
                            value={newd?.description}
                            onChange={handleDescriptionChange}
                          />
                        ) : (
                          <Typography variant='body1'>{newd?.description}</Typography>
                        )}
                      </Grid>
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}
          <Dialog open={isLoading}>
            <DialogContent>
              <StyledDialogContentText>Generating... Please wait...</StyledDialogContentText>
              <ImageContainer>
                <img src={imageUrl} alt='' />
              </ImageContainer>
              <LinearProgress color='primary' />
            </DialogContent>
          </Dialog>

          <Grid item xs={12} sm={6}>
            <Card>
              <CardHeader
                title='Share QR Code'
                titleTypographyProps={{ variant: 'h6' }}
                action={
                  <>
                    <Tooltip title='Share QR Code with Team Groups'>
                      <IconButton onClick={handleSend}>
                        <SendIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                }
              />
            </Card>
          </Grid>
        </Grid>
      )}

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        sx={{
          width: '40%',
          margin: 'auto'
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardHeader title='Select Team Member to Share With:' />
          <CardContent>
            {groupMember.map(group => (
              <Card
                key={group.groupId}
                sx={{
                  marginBottom: '0.5rem',
                  backgroundColor: selectedGroup === group ? 'inherit' : 'inherit'
                }}
              >
                <FormControlLabel
                  control={<Checkbox checked={selectedGroup === group} onChange={() => setSelectedGroup(group)} />}
                  label={group.username}
                />
              </Card>
            ))}
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                if (selectedGroup) {
                  sendAdvertisement(selectedGroup.userId)
                }
                handleCloseModal()
              }}
            >
              Select
            </Button>
          </CardActions>
        </Card>
      </Modal>

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
    </>
  )
}

// @ts-ignore
export default authRoute(SingleContent)
