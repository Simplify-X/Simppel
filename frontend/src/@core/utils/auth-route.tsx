import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from 'js-cookie';

const authRoute = (Component: JSX.IntrinsicAttributes) => {
  return (props: JSX.IntrinsicAttributes) => {
    const router = useRouter();
    const [user, setUser] = useState({});
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkToken = async () => {
        const token = Cookies.get('token');
        if (!token) {
          router.replace("/pages/login");
        } 
        else{
          setAuthenticated(true);
        }
        setLoading(false);
      };
      checkToken();
    }, []);

    if (loading) {
      return <CircularProgress />;
    }

    if (authenticated) {
      // @ts-ignore
      return <Component {...props} user={user} />;
    } else {
      return <CircularProgress />;
    }
  };
};

export default authRoute;
