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
import CategoryIcon from '@mui/icons-material/Category'
import LocationSearchingIcon from '@mui/icons-material/LocationSearching'
import LogoDevIcon from '@mui/icons-material/LogoDev'
import PostAddIcon from '@mui/icons-material/PostAdd'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'
import PagesIcon from '@mui/icons-material/Pages'
import AutoModeIcon from '@mui/icons-material/AutoMode'
import WorkspacesIcon from '@mui/icons-material/Workspaces'
import SearchIcon from '@mui/icons-material/Search'
import BuildIcon from '@mui/icons-material/Build'
import ScienceIcon from '@mui/icons-material/Science'
import BiotechIcon from '@mui/icons-material/Biotech'
import DescriptionIcon from '@mui/icons-material/Description';
import SourceIcon from '@mui/icons-material/Source';

// ** Type import
import { NavLink, NavSectionTitle, VerticalNavItemsType } from 'src/@core/layouts/types'
import { useUserData } from 'src/@core/hooks/useUserData'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'

interface UserData {
  role?: string
  advertisementEnabled?: boolean
  accountId?: string
  customTabEnabled?: boolean
  copyWritingEnabled?: boolean
  automationEnabled?: boolean
  spyToolsEnabled?: boolean
  productSearchEnabled?: boolean
  qrCodeGeneratorEnabled? : boolean
  aiTemplateGenerationEnabled? :boolean
}

const Navigation = (): VerticalNavItemsType => {
  const { t } = useTranslation()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [userData, setUserData] = useState<UserData>({
    role: '',
    advertisementEnabled: false,
    customTabEnabled: false,
    copyWritingEnabled: false,
    automationEnabled: false,
    spyToolsEnabled: false,
    productSearchEnabled: false,
    qrCodeGeneratorEnabled: false,
    aiTemplateGenerationEnabled: false,
  })

  const [customForms, setCustomForms] = useState<any[]>([])

  const { error, get } = useCustomApiHook()
  const { token } = useUserData()

  useEffect(() => {
    token && handleGetUser(token)
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setCustomForms(res?.data)
  }

  if (!userData.accountId) return null

  const generateCustomTabs = () => {
    const activeCustomForms = customForms?.filter(form => form.isActive)
    const customTabs = []

    if (userData.customTabEnabled) {
      customTabs.push(
        ...activeCustomForms.map(form => ({
          title: form.formName,
          icon: HomeOutline,
          path: `/dynamic-form/${form.id}`
        }))
      )

      if (!userData.role && activeCustomForms.length > 0) {
        customTabs.unshift({
          sectionTitle: 'Custom'
        })
      }
    }

    return customTabs
  }

  const basicMenuItems = [
    {
      title: t('user_management'),
      icon: PersonAddAltIcon,
      path: '/user-management'
    },
    {
      title: t('invite_team_members'),
      icon: GroupsIcon,
      path: '/invite-team'
    },
    {
      title: t('account_settings'),
      icon: AccountCogOutline,
      path: '/account-settings'
    }
  ]

  const customFormMenuItem = {
    title: t('custom_form'),
    icon: DashboardCustomizeIcon,
    path: '/custom-form'
  }

  return [
    userData?.productSearchEnabled &&
      !userData.role && {
        title: t('product_search'),
        icon: LocationSearchingIcon,
        path: '/product-search'
      },

      userData?.aiTemplateGenerationEnabled &&
      !userData.role && {
        title: t('AI Template'),
        icon: SourceIcon,
        path: '/ai-template'
      },

    userData?.productSearchEnabled &&
      userData?.spyToolsEnabled &&
      !userData.role && {
        sectionTitle: t('product_spy')
      },

    userData?.spyToolsEnabled &&
      !userData.role && {
        title: t('spy_tools'),
        icon: ArticleIcon,
        openByDefault: true,
        path: '',
        children: [
          {
            title: t('tiktok_spy_tools'),
            icon: SearchIcon,
            path: '/tiktok/search'
          },
          {
            title: t('ebay_spy_tools'),
            icon: SearchIcon,
            path: '/ebay/search'
          }
        ]
      },

    userData.advertisementEnabled &&
      !userData.role && {
        sectionTitle: t('content')
      },

    userData.advertisementEnabled &&
      !userData.role && {
        title: t('advertisement'),
        icon: PagesIcon,
        path: '',
        children: [
          // The submenu items
          {
            title: t('add_advertisement'),
            icon: AddIcon,
            path: '/content/add'
          },
          {
            title: t('view_advertisement'),
            icon: VisibilityIcon,
            path: '/content/view'
          },
          {
            title: 'Product Information',
            icon: CategoryIcon,
            path: '/content/product-details'
          }
        ]
      },

      userData?.qrCodeGeneratorEnabled &&
      !userData.role && {
        sectionTitle: "QR Code Dynamic Generator"
      },

    userData?.qrCodeGeneratorEnabled &&
      !userData.role && {
        title: "QR Code Gen",
        icon: ArticleIcon,
        openByDefault: true,
        path: '',
        children: [
          {
            title: "Generator",
            icon: SearchIcon,
            path: '/qr-code/view'
          },
        ]
      },

      userData.advertisementEnabled &&
      !userData.role && {
        sectionTitle: t('content')
      },
      

    userData.copyWritingEnabled &&
      !userData.role && {
        title: t('seo_tools'),
        icon: BuildIcon,
        path: '',
        children: [
          {
            title: t('keyword_research'),
            icon: ScienceIcon,
            path: '/seo-tools/keyword-research/find'
          },
          {
            title: t('seo_analysis'),
            icon: BiotechIcon,
            path: '/seo-tools/keyword-research/seo-analysis'
          }
        ]
      },

    userData.copyWritingEnabled &&
      !userData.role && {
        sectionTitle: t('copy_writing')
      },

    userData.copyWritingEnabled &&
      !userData.role && {
        title: t('copy_writing'),
        icon: ArticleIcon,
        path: '',
        children: [
          // The submenu items
          {
            title: t('create_copy'),
            icon: NotesIcon,
            path: '/writing/add'
          },
          {
            title: t('view_copy'),
            icon: VisibilityIcon,
            path: '/writing/view'
          }
        ]
      },

    userData?.automationEnabled &&
      !userData.role && {
        sectionTitle: t('automation')
      },

    userData?.automationEnabled &&
      !userData.role && {
        title: t('post_automation'),
        icon: AutoModeIcon,
        path: '',
        children: [
          // The submenu items
          {
            title: 'Create Post Automation',
            icon: AlarmAddIcon,
            path: '/automation/add'
          },
          {
            title: 'View Automation',
            icon: VisibilityIcon,
            path: '/automation/view'
          }
        ]
      },

    !userData.role &&
      !userData.isLinkedToTeamGroup && {
        sectionTitle: t('management')
      },

    !userData.role &&
      !userData.isLinkedToTeamGroup && {
        title: t('management'),
        icon: WorkspacesIcon,
        openByDefault: true,
        path: '',
        children: [...basicMenuItems, ...(userData.customTabEnabled ? [customFormMenuItem] : [])]
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
      sectionTitle: ' AI generation'
    },

    userData.role && {
      title: 'Template generation',
      icon: DescriptionIcon,
      path: '',
      children: [
        // The submenu items
        {
          title: 'Add Template',
          icon: AddIcon,
          path: '/global-administrator/ai-template/add'
        },
        {
          title: 'View Template',
          icon: VisibilityIcon,
          path: '/global-administrator/ai-template/view'
        }
      ]
    },

    userData.role && {
      sectionTitle: ' UI Design'
    },

    userData.role && {
      title: 'Customize UI',
      icon: PeopleIcon,
      path: '',
      children: [
        // The submenu items
        {
          title: 'Tiktok Filter UI',
          icon: AlarmAddIcon,
          path: '/global-administrator/tiktok/filter'
        }
      ]
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
