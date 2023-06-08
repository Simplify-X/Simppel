// @ts-nocheck
import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiAvatar, { AvatarProps } from '@mui/material/Avatar'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography, { TypographyProps } from '@mui/material/Typography'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'

import BellOutline from 'mdi-material-ui/BellOutline'
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&.unread': {
    backgroundColor: theme.palette.action.hover
  }
}))

const styles = {
  maxHeight: 349,
  '& .MuiMenuItem-root:last-of-type': {
    border: 0
  }
}

const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  ...styles
})

const Avatar = styled(MuiAvatar)<AvatarProps>({
  width: '2.375rem',
  height: '2.375rem',
  fontSize: '1.125rem'
})

const MenuItemTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75)
}))

const MenuItemSubtitle = styled(Typography)<TypographyProps>({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

const NotificationDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { get } = useCustomApiHook()

  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification)
    setDialogOpen(true)
    notification.read = true
    saveNotificationsToLocalStorage(notifications) // Save updated notifications to localStorage
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  useEffect(() => {
    async function getNotifications() {
      const getAllNotifications = await get(`/notifications`)
      const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || []

      // Merge stored notifications with newly fetched notifications
      const mergedNotifications = getAllNotifications.data.map((notification) => {
        const storedNotification = storedNotifications.find((stored) => stored.id === notification.id)
        if (storedNotification) {
          return {
            ...notification,
            read: storedNotification.read // Use stored read status
          }
        } else {
          return notification
        }
      })

      setNotifications(mergedNotifications)
      setLoading(false)
    }
    getNotifications()
  }, [])

  const saveNotificationsToLocalStorage = (notifications) => {
    const storedNotifications = notifications.map((notification) => ({
      id: notification.id,
      read: notification.read
    }))
    localStorage.setItem('notifications', JSON.stringify(storedNotifications))
  }

  const ScrollWrapper = ({ children }) => {
    if (hidden) {
      return <Box sx={{ ...styles, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
    }
  }

  if (loading) {
    // Render loading state here
    return null
  }

  const sortedNotifications = [...notifications].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at)
  })

  return (
    <>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <BellOutline />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disableRipple>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ fontWeight: 600 }}>Notifications</Typography>
            <Chip
              size='small'
              label={`${notifications.length} New`}
              color='primary'
              sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
            />
          </Box>
        </MenuItem>
        <ScrollWrapper>
          {sortedNotifications.map((notification) => (
            <MenuItem
              className={!notification.read ? 'unread' : ''}
              onClick={() => handleNotificationClick(notification)}
              key={notification.id}
            >
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <Avatar alt={notification.title} src='/images/avatars/4.png' />
                <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                  <MenuItemTitle>{notification.title}</MenuItemTitle>
                  <MenuItemSubtitle variant='body2' dangerouslySetInnerHTML={{ __html: notification.description }} />
                </Box>
                <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                  {new Date(notification.created_at).toLocaleString()}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </ScrollWrapper>
        <MenuItem
          disableRipple
          sx={{ py: 3.5, borderBottom: 0, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
        >
          <Button fullWidth variant='contained' onClick={handleDropdownClose}>
            Read All Notifications
          </Button>
        </MenuItem>
      </Menu>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{selectedNotification?.title}</DialogTitle>
        <DialogContent dangerouslySetInnerHTML={{ __html: selectedNotification?.description }} />
      </Dialog>
    </>
  )
}

export default NotificationDropdown

