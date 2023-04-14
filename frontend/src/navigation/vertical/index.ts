// ** Icon imports
// @ts-nocheck// @ts-nocheck
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import PeopleIcon from '@mui/icons-material/People';
import * as Sentry from "@sentry/nextjs";
import NotesIcon from '@mui/icons-material/Notes';
import {useTranslation} from 'react-i18next';
import AlarmAddIcon from '@mui/icons-material/AlarmAdd';

// ** Type import
import { NavLink, NavSectionTitle, VerticalNavItemsType } from 'src/@core/layouts/types'
import { API_BASE_URL } from 'src/config'


interface UserData {
  role?: string;
  advertisementEnabled?: boolean;
}



const navigation = (): VerticalNavItemsType => {
  const {t} = useTranslation();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [userData, setUserData] = useState<UserData>({
    role: '',
    advertisementEnabled: false,
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      // Token not found, redirect to login page
      window.location.replace('login');

      return;
    }

    fetch(`${API_BASE_URL}/users/role`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          // Get account ID from response body
          return response.json();
        } else {
          // Token not valid, redirect to login page
          throw new Error('Invalid token');
        }
      })
      .then((data) => { 
        setUserData(data);
      })
      .catch((error) => {
        Sentry.captureException(error);
        window.location.replace('login');
      });
  }, []);


  return [
    {
      title: t('dashboard'),
      icon: HomeOutline,
      path: '/'
    },
    {
      title: t('account_settings'),
      icon: AccountCogOutline,
      path: '/account-settings'
    },
    userData.advertisementEnabled && {
      sectionTitle: 'Content'
    },
    userData.advertisementEnabled && {
      title: t('add_advertisement'),
      icon: AddIcon,
      path: '/content',
    },
    userData.advertisementEnabled && {
      title: t('view_advertisement'),
      icon: VisibilityIcon,
      path: '/content/view-content',
    },

    {
      sectionTitle: 'Copy Writing'
    },
    {
      title: t('create_copy'),
      icon: NotesIcon,
      path: '/writing',
    },
    {
      title: t('view_copy'),
      icon: VisibilityIcon,
      path: '/view-writing',
    },

    {
      sectionTitle: 'Automation'
    },
    {
      title: "Create Post Automation",
      icon: AlarmAddIcon,
      path: '/automation',
    },
    {
      title: "View Automation",
      icon: VisibilityIcon,
      path: '/automation/view-automation',
    },

    userData.role && {
      sectionTitle: 'Users'
    },

    userData.role && {
      title: 'View Users',
      icon: PeopleIcon,
      path: '/users',
    },

    // {
    //   sectionTitle: 'Pages'
    // },
    // {
    //   title: 'Login',
    //   icon: Login,
    //   path: '/login',
    //   openInNewTab: true
    // },
    // {
    //   title: 'Register',
    //   icon: AccountPlusOutline,
    //   path: '/register',
    //   openInNewTab: true
    // },
    // {
    //   title: 'Error',
    //   icon: AlertCircleOutline,
    //   path: '/pages/error',
    //   openInNewTab: true
    // },
    // {
    //   sectionTitle: 'User Interface'
    // },
    // {
    //   title: 'Typography',
    //   icon: FormatLetterCase,
    //   path: '/typography'
    // },
    // {
    //   title: 'Icons',
    //   path: '/icons',
    //   icon: GoogleCirclesExtended
    // },
    // {
    //   title: 'Cards',
    //   icon: CreditCardOutline,
    //   path: '/cards'
    // },
    // {
    //   title: 'Tables',
    //   icon: Table,
    //   path: '/tables'
    // },
    // {
    //   icon: CubeOutline,
    //   title: 'Form Layouts',
    //   path: '/form-layouts'
    // }
  ].filter(Boolean) as Array<NavLink | NavSectionTitle>;
}

export default navigation
