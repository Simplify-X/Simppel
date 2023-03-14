import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const authRoute = (Component: any) => {
  return (props: any) => {
    const router = useRouter();
    const [user, setUser] = useState({});
    const [authenticated, setAuthenticated] = useState(false);    
      
    useEffect(() => {
      const checkToken = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          router.replace("/pages/login");
        } else {
          // check if user exists and token valid
          const isValidToken = true
          if (!isValidToken) {
            localStorage.removeItem("token");
            router.replace("/pages/login");
          } else {
            // in case you need pass some user data
            // I suppose you'll receive some of it from validation request
            const userData = {
              name: "test user"
            };
            if (userData.name === '') {
              router.replace("/pages/login");
              localStorage.removeItem('token');
            } else {
              setUser(userData);
              setAuthenticated(true);
            }
          }
        }
      }
      checkToken();
    }, []);
  
    if (authenticated) {
      return <Component {...props} user={user} />;
    } else {
      return null;
    }
  }
};  
export default authRoute;