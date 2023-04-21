import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
 
const useAuthenticateUser = () => {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
      checkToken();
    }, []);

    const router = useRouter()
    const checkToken = async () => {
      try {
        const token = Cookies.get('token')
        if (!token) router.replace('login')
        if(token){
          setAuthenticated(true)
        }
      } catch (error) {
        
      }finally{
        setLoading(false)
      }
    }
  

  return {loading, authenticated}
}
 
export default useAuthenticateUser;