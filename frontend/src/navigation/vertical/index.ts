// ** Icon imports
// @ts-nocheck// @ts-nocheck
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import PeopleIcon from '@mui/icons-material/People'
import * as Sentry from '@sentry/nextjs'
import NotesIcon from '@mui/icons-material/Notes'
import { useTranslation } from 'react-i18next'
import AlarmAddIcon from '@mui/icons-material/AlarmAdd'
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import EmailIcon from '@mui/icons-material/Email';
import ShareIcon from '@mui/icons-material/Share';
import ArticleIcon from '@mui/icons-material/Article';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

// ** Type import
import { NavLink, NavSectionTitle, VerticalNavItemsType } from 'src/@core/layouts/types'
import { API_BASE_URL } from 'src/config'
import { Icon } from '@mui/material'

interface UserData {
  role?: string
  advertisementEnabled?: boolean
}

const navigation = (): VerticalNavItemsType => {
  const { t } = useTranslation()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [userData, setUserData] = useState<UserData>({
    role: '',
    advertisementEnabled: false
  })

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      // Token not found, redirect to login page
      window.location.replace('login')

      return
    }

    fetch(`${API_BASE_URL}/users/role`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          // Get account ID from response body
          return response.json()
        } else {
          // Token not valid, redirect to login page
          throw new Error('Invalid token')
        }
      })
      .then(data => {
        setUserData(data)
      })
      .catch(error => {
        Sentry.captureException(error)
        window.location.replace('login')
      })
  }, [])

  return [
    !userData.role && {
      title: t('dashboard'),
      icon: HomeOutline,
      path: '/'
    },
    userData.advertisementEnabled &&
      !userData.role && {
        sectionTitle: 'Content'
      },
    userData.advertisementEnabled &&
      !userData.role && {
        title: t('add_advertisement'),
        icon: AddIcon,
        path: '/content'
      },
    userData.advertisementEnabled &&
      !userData.role && {
        title: t('view_advertisement'),
        icon: VisibilityIcon,
        path: '/content/view-content'
      },

    !userData.role && {
      sectionTitle: 'Copy Writing'
    },

    !userData.role && {
      title: t('create_copy'),
      icon: NotesIcon,
      path: '/writing'
    },
    !userData.role && {
      title: t('view_copy'),
      icon: VisibilityIcon,
      path: '/view-writing'
    },

    !userData.role && {
      sectionTitle: 'Automation'
    },
    !userData.role && {
      title: 'Create Post Automation',
      icon: AlarmAddIcon,
      path: '/automation'
    },
    !userData.role && {
      title: 'View Automation',
      icon: VisibilityIcon,
      path: '/automation/view-automation'
    },

    !userData.role && {
      sectionTitle: 'Management'
    },

    !userData.role && {
      title: 'User Management',
      icon: PersonAddAltIcon,
      path: '/user-management'
    },

    !userData.role && {
      title: 'Invite Team Members',
      icon: GroupsIcon,
      path: '/invite-team'
    },

    !userData.role && {
      title: t('account_settings'),
      icon: AccountCogOutline,
      path: '/account-settings'
    },

    userData.role && {
      sectionTitle: ' Management',
    },

    userData.role && {
      title: 'Generated Adverts',
      icon: ArticleIcon,
      path: '/generated-ad'
    },

    userData.role && {
      title: 'Notifications',
      icon: NotificationAddIcon,
      path: '/notifications'
    },

    userData.role && {
      title: 'Send Email',
      icon: EmailIcon,
      path: '/email'
    },

    userData.role && {
      sectionTitle: ' Account Management',

    },

    userData.role && {
      title: 'View Users',
      icon: PeopleIcon,
      path: '/global-administrator/users'
    },

    userData.role && {
      title: 'Invited Accounts',
      icon: ShareIcon,
      path: '/notifications'
    },

    userData.role && {
      title: 'Unactive Accounts',
      icon: NoAccountsIcon,
      path: '/global-administrator/unactive-accounts'
    },


  ].filter(Boolean) as Array<NavLink | NavSectionTitle>
}

export default navigation
