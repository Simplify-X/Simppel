// ** MUI Imports
// @ts-nocheck
import { useEffect, useState } from 'react'
import authRoute from 'src/@core/utils/auth-route'
import MUIDataTable from 'mui-datatables'
import { useRouter } from 'next/router'
import * as Sentry from '@sentry/nextjs'
import { API_BASE_URL } from 'src/config'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import Loader from 'src/@core/components/ui/Loader'

const AllInvitedUsers = () => {
  const [role, setRole] = useState([])
  const router = useRouter()
  const { get } = useCustomApiHook()
  const [teamGroup, setTeamGroup] = useState({})
  const [userExtension, setUserExtension] = useState({})
  const [isUserExtensionLoading, setIsUserExtensionLoading] = useState(true)
  const [isTeamGroupLoading, setIsTeamGroupLoading] = useState(false)

  const handleClick = rowData => {
    fetch(`${API_BASE_URL}/users/getSingleUser/${rowData}`)
      .then(response => response.json())
      .then(data => {
        router.push(`/global-administrator/users/view-user?id=${data.accountId}`)
      })
      .catch(error => {
        Sentry.captureException(error)
      })
  }

  const columns = [
    {
      name: 'accountId',
      label: 'Id',
      options: {
        filter: true,
        sort: true,
        display: 'none'
      }
    },
    {
      name: 'username',
      label: 'Username',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'userId',
      label: 'Email',
      options: {
        filter: true,
        sort: true,
        customBodyRender: value => {
          return userExtension[value]?.email || '-'
        }
      }
    },
    {
      name: 'teamGroupId',
      label: 'Team Group Name',
      options: {
        filter: true,
        sort: true,
        customBodyRender: value => {
          return teamGroup[value]?.groupName || '-'
        }
      }
    },
    {
      name: 'accountRole',
      label: 'Role',
      options: {
        filter: true,
        sort: false,
        customBodyRender: value => {
          return value === 0 ? 'User' : 'Account Admin'
        }
      }
    }
  ]

  const options = {
    filterType: 'dropdown',
    onRowClick: rowData => {
      handleClick(rowData[0])
    }
  }

  async function getInvitedUsers() {
    const getInactiveUsers = await get(`/groups/members/getInvitedUsers`)
    setRole(getInactiveUsers?.data)
  }

  async function fetchTeamGroup(teamGroupId) {
    setIsTeamGroupLoading(true)
    const response = await get(`/groups/list/${teamGroupId}`)
    setTeamGroup(prev => ({ ...prev, [teamGroupId]: response?.data }))
    setIsTeamGroupLoading(false)
  }

  async function fetchUserExtendedDetails(userId) {
    setIsUserExtensionLoading(true)
    const response = await get(`/users/getSingleUser/${userId}`)
    setUserExtension(prev => ({ ...prev, [userId]: response?.data }))
    setIsUserExtensionLoading(false)
  }

  const sortedArray = [...role].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  useEffect(() => {
    role.forEach(user => {
      if (user.teamGroupId) {
        fetchTeamGroup(user.teamGroupId)
      }
    })
  }, [role])

  useEffect(() => {
    role.forEach(user => {
      if (user.userId) {
        fetchUserExtendedDetails(user.userId)
      }
    })
  }, [role])

  useEffect(() => {
    getInvitedUsers()
  }, [])
  
  

  if (isUserExtensionLoading || isTeamGroupLoading) {
    return <Loader />
  }

  return <MUIDataTable title={'Invited User List'} data={sortedArray} columns={columns} options={options} />
}

// @ts-ignore
export default authRoute(AllInvitedUsers)
