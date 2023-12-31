// @ts-nocheck
import React, { useState, useEffect } from 'react'
import {
  Typography,
  Grid,
  Divider,
} from '@mui/material'
import { useRouter } from 'next/router'
import Loader from 'src/@core/components/ui/Loader'
import { Helmet } from 'react-helmet'




const DynamicViewDetails: React.FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [header, setHeaderName] = useState([])
  

  
  const { id } = router.query


  useEffect(() => {
    if (id) {
      const fetchTableData = async () => {
        const res = await get(`/dynamic-fields/by-table-id/${id}`)
        const headerName = await get(`/dynamic-fields/formName/${id}`)
        setData(res?.data)
        setHeaderName(headerName?.data);
        setLoading(false)
      }

      fetchTableData()
    }
  }, [id])

  console.log(data)


  if (loading) {
    return <Loader />
  }

  return (
    <>
      <Helmet>
        <title>View Ebay Product</title>
      </Helmet>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h1>{header} custom form</h1>
          {data.map((field, index) => (
            <Grid container key={index} spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h6" component="h2">
                  {field.fieldName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">{field.fieldValue}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  )
}

export default DynamicViewDetails