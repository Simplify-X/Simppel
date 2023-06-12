// ** React Imports
import { ElementType, ReactNode } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton'

// ** Configs Import
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { NavLink } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'

// ** Utils
import { handleURLQueries } from 'src/@core/layouts/utils'

import { useState } from 'react'
import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

interface Props {
  item: NavLink
  settings: Settings
  navVisible?: boolean
  toggleNavVisibility: () => void
}

// ** Styled Components
const MenuNavLink = styled(ListItemButton)<
  ListItemButtonProps & { component?: ElementType; target?: '_blank' | undefined }
>(({ theme }) => ({
  width: '100%',
  borderTopRightRadius: 100,
  borderBottomRightRadius: 100,
  color: theme.palette.text.primary,
  padding: theme.spacing(2.25, 3.5),
  transition: 'opacity .25s ease-in-out',
  '&.active, &.active:hover': {
    boxShadow: theme.shadows[3],
    backgroundImage: `linear-gradient(98deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.main} 94%)`
  },
  '&.active .MuiTypography-root, &.active .MuiSvgIcon-root': {
    color: `${theme.palette.common.white} !important`
  }
}))

const MenuItemTextMetaWrapper = styled(Box)<BoxProps>({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
})

const VerticalNavLink = ({ item, navVisible, toggleNavVisibility }: Props) => {
  // ** Hooks
  const router = useRouter()

  const IconTag: ReactNode = item.icon

  const isNavLinkActive = () => {
    if (router.pathname === item.path || handleURLQueries(router, item.path)) {
      return true
    } else {
      return false
    }
  }

  const [open, setOpen] = useState(false)

  const handleToggle = () => {
    setOpen(!open)
  }

  const handleMenuNavLink = (item: any) => {
    return (
      <MenuNavLink
        component={'a'}
        className={isNavLinkActive() ? 'active' : ''}
        {...(item.openInNewTab ? { target: '_blank' } : null)}
        onClick={e => {
          if (item.path === undefined) {
            e.preventDefault()
            e.stopPropagation()
          }
          if (navVisible) {
            toggleNavVisibility()
          }
        }}
        sx={{
          pl: 5.5,
          ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' })
        }}
      >
        <ListItemIcon
          sx={{
            mr: 2.5,
            color: 'text.primary',
            transition: 'margin .25s ease-in-out'
          }}
        >
          <UserIcon icon={IconTag} />
        </ListItemIcon>

        <MenuItemTextMetaWrapper>
          <Typography {...(themeConfig.menuTextTruncate && { noWrap: true })}>{item.title}</Typography>

          {item.badgeContent ? (
            <Chip
              label={item.badgeContent}
              color={item.badgeColor || 'primary'}
              sx={{
                height: 20,
                fontWeight: 500,
                marginLeft: 1.25,
                '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
              }}
            />
          ) : null}
        </MenuItemTextMetaWrapper>
      </MenuNavLink>
    )
  }

  return (
    <ListItem
      disablePadding
      className='nav-link'
      disabled={item.disabled || false}
      sx={{ mt: 1.5, px: '0 !important' }}
    >


      {/* --------------- added sub menus ---------------- */}
      {item.title === 'Product search' ? (
        <List>
          <ListItem sx={{ mt: 1.5, px: '0 !important' }} onClick={handleToggle}>
            <Link passHref href={item.path === undefined ? '/' : `${item.path}`}>
              {handleMenuNavLink(item)}
            </Link>
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          {open && (
            <List component='div' disablePadding sx={{ display: 'grid', gap: 1 }}>
              <ListItem sx={{ cursor: 'pointer' }}>
                <Link href={item.path + '/1' ?? '/'}>
                  {/* {handleMenuNavLink(item)} */}
                  <ListItemText inset primary='🐱‍🏍 Product 1' />
                </Link>
              </ListItem>
              <ListItem sx={{ cursor: 'pointer' }}>
                <Link href={item.path + '/2' ?? '/'}>
                  {/* {handleMenuNavLink(item)} */}
                  <ListItemText inset primary='🐱‍🏍 Product 2' />
                </Link>
              </ListItem>
              <ListItem sx={{ cursor: 'pointer' }}>
                <Link href={item.path + '/3' ?? '/'}>
                  {/* {handleMenuNavLink(item)} */}
                  <ListItemText inset primary='🐱‍🏍 Product 3' />
                </Link>
              </ListItem>
            </List>
          )}
        </List>
      ) : (
        <Link passHref href={item.path === undefined ? '/' : `${item.path}`}>
          {handleMenuNavLink(item)}
        </Link>
      )}
    </ListItem>
  )
}

export default VerticalNavLink
