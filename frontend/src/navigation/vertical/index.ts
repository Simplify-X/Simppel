// ** Icon imports
// @ts-nocheck// @ts-nocheck
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useEffect, useState } from 'react'
import PeopleIcon from '@mui/icons-material/People'
import * as Sentry from '@sentry/nextjs'
import NotesIcon from '@mui/icons-material/Notes'
import { useTranslation } from 'react-i18next'
import AlarmAddIcon from '@mui/icons-material/AlarmAdd'
import NotificationAddIcon from '@mui/icons-material/NotificationAdd'
import EmailIcon from '@mui/icons-material/Email'
import ShareIcon from '@mui/icons-material/Share'
import ArticleIcon from '@mui/icons-material/Article'
import NoAccountsIcon from '@mui/icons-material/NoAccounts'
import GroupsIcon from '@mui/icons-material/Groups'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import CategoryIcon from '@mui/icons-material/Category';

// ** Type import
import { NavLink, NavSectionTitle, VerticalNavItemsType } from 'src/@core/layouts/types'
import { useUserData } from 'src/@core/hooks/useUserData'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'

interface UserData {
  role?: string
  advertisementEnabled?: boolean
  accountId?: string
}

const Navigation = (): VerticalNavItemsType=> {
  const { t } = useTranslation()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [userData, setUserData] = useState<UserData>({
    role: '',
    advertisementEnabled: false
  })

  const { error, get } = useCustomApiHook()
  const { token } = useUserData()


  useEffect(() => {
    token && handleGetUser(token)
  }, [token])

  const handleGetUser = async (token: string) => {
    const userData = await get(`/users/role`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    // if (!userData?.data) throw new Error('Invalid token')

    userData?.data && setUserData(userData?.data as UserData)
  }

  useEffect(() => {
    if (error) {
      Sentry.captureException(error)
      window.location.replace('/login')
    }
  }, [error])

  if(!userData.accountId) return null;

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
    
    userData.advertisementEnabled &&
    !userData.role && {
      title: "Product Information",
      icon: CategoryIcon,
      path: '/content/product-details'
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
      sectionTitle: ' Management'
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
      sectionTitle: ' Account Management'
    },

    userData.role && {
      title: 'View Users',
      icon: PeopleIcon,
      path: '/global-administrator/users'
    },

    userData.role && {
      title: 'Invited Accounts',
      icon: ShareIcon,
      path: '/global-administrator/invited-users'
    },

    userData.role && {
      title: 'Unactive Accounts',
      icon: NoAccountsIcon,
      path: '/global-administrator/unactive-accounts'
    }
  ].filter(Boolean) as Array<NavLink | NavSectionTitle>
}

export default Navigation
