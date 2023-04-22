import { useState } from 'react'


const authRoute = (Component: JSX.IntrinsicAttributes) => {
  return (props: JSX.IntrinsicAttributes) => {
    const [user] = useState()

    // @ts-ignore
    return <Component {...props} user={user} />
  }
}

export default authRoute
