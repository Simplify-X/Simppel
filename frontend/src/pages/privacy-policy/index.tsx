// ** React Imports
import { ReactNode } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

const PrivacyPolicyPage = () => {
  return (
    <Box className='content-center'>
      <Card>
        <CardContent>
          <Box sx={{ maxWidth: '800px', mx: 'auto', p: 4 }}>
            <Typography variant='h2' sx={{ mb: 4 }}>
              Privacy Policy
            </Typography>
            <Typography variant='body1' component='ol' sx={{ mb: 4 }}>
              <li>Data Collection and Usage: When you use our app/website, we may collect certain user data, such as device information and usage analytics, to improve and personalize the app/website experience. We do not collect or store any personal information from the TikTok API.</li>
              <li>TikTok API Data: In order to fetch and display TikTok posts, our app/website may retrieve publicly available data from the TikTok API, including video metadata, captions, and engagement metrics. This data is used solely for the purpose of displaying TikTok posts on our app/website.</li>
              <li>Data Security: We take appropriate measures to protect the security of user data, including TikTok API data, and prevent unauthorized access or disclosure. However, please note that the TikTok API data is provided by TikTok and subject to TikTok's own data security measures.</li>
              <li>Third-Party Services: Our app/website may use third-party services or analytics tools to enhance functionality or improve user experience. These third-party services may collect and process user data according to their respective privacy policies.</li>
              <li>Updates to the Privacy Policy: We reserve the right to update our Privacy Policy to reflect changes in our data practices or legal requirements. Any updates will be posted on our app/website, and we encourage you to review the Privacy Policy periodically.</li>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

PrivacyPolicyPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default PrivacyPolicyPage
