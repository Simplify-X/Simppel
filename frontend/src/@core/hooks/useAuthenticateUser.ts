import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useCustomApiHook from "./useCustomApiHook";

interface UserData {
  
}
 
const useAuthenticateUser = () => {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser]= useState<UserData | string>("")
    const {get} = useCustomApiHook();


    useEffect(() => {
      checkToken();
    }, []);

    const router = useRouter()
    const checkToken = async () => {
      try {
        const token = Cookies.get('token')
        if (!token) router.replace('login')
        if(token){
          handleGetUser(token)
          setAuthenticated(true)
        }
      } catch (error) {
        
      }finally{
        setLoading(false)
      }
    }

    
    const handleGetUser = async (token: string) => {
      const userData = await get(`/users/role`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!userData?.data) throw new Error('Invalid token')
      else setUser(userData?.data as UserData)
    }
  

  return {loading, authenticated, user}
}
 
export default useAuthenticateUser;