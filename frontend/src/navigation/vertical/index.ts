// ** Icon imports
// @ts-nocheck
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
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';

// ** Type import
import { NavLink, NavSectionTitle, VerticalNavItemsType } from 'src/@core/layouts/types'
import { useUserData } from 'src/@core/hooks/useUserData'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'

interface UserData {
  role?: string
  advertisementEnabled?: boolean
  accountId?: string
  customTabEnabled?: boolean
}

const Navigation = (): VerticalNavItemsType=> {
  const { t } = useTranslation()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [userData, setUserData] = useState<UserData>({
    role: '',
    advertisementEnabled: false,
    customTabEnabled: false
  })

  const [customForms, setCustomForms] = useState<any[]>([]);

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


  useEffect(() => {
    userData?.accountId && fetchCustomForm()
  }, [userData?.accountId])

  const fetchCustomForm = async () => {
    const res = await get(`/customForm/${userData?.accountId}`)
    setCustomForms(res?.data);
  }


  if(!userData.accountId) return null;


  const generateCustomTabs = () => {
    const activeCustomForms = customForms?.filter((form) => form.isActive);
    const customTabs = [];
  
    if (userData.customTabEnabled) {
      customTabs.push(
        ...activeCustomForms.map((form) => ({
          title: form.formName,
          icon: HomeOutline,
          path: `/dynamic-form/${form.id}`,
        }))
      );
  
      if (!userData.role && activeCustomForms.length > 0) {
        customTabs.unshift({
          sectionTitle: 'Custom',
        });
      }
    }
  
    return customTabs;
  };
  
  

  return [
    !userData.role && {
      title: t('dashboard'),
      icon: HomeOutline,
      path: '/'
    },

    !userData.role && {
      title: t('product_search'),
      icon: LocationSearchingIcon,
      path: '/product/search'
    },
    
    userData.advertisementEnabled &&
      !userData.role && {
        sectionTitle: 'Content'
      },
    userData.advertisementEnabled &&
      !userData.role && {
        title: t('add_advertisement'),
        icon: AddIcon,
        path: '/content/add'
      },
    userData.advertisementEnabled &&
      !userData.role && {
        title: t('view_advertisement'),
        icon: VisibilityIcon,
        path: '/content/view'
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
      path: '/writing/add'
    },
    !userData.role && {
      title: t('view_copy'),
      icon: VisibilityIcon,
      path: '/writing/view'
    },

    !userData.role && {
      sectionTitle: 'Automation'
    },
    !userData.role && {
      title: 'Create Post Automation',
      icon: AlarmAddIcon,
      path: '/automation/add'
    },
    !userData.role && {
      title: 'View Automation',
      icon: VisibilityIcon,
      path: '/automation/view'
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

    userData.customTabEnabled &&
    !userData.role && {
      title: 'Custom Form',
      icon: DashboardCustomizeIcon,
      path: '/custom-form'
    },

    ...generateCustomTabs(),

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
      path: '/global-administrator/notifications'
    },

    userData.role && {
      title: 'Send Email',
      icon: EmailIcon,
      path: '/email'
    },

    userData.role && {
      title: 'Add Product',
      icon: PostAddIcon,
      path: '/global-administrator/dropshipping'
    },

    userData.role && {
      title: 'Logs',
      icon: LogoDevIcon,
      path: '/global-administrator/logs'
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
