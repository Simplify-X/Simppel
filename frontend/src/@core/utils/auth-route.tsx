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
        } else {
          // check if user exists and token valid
          const isValidToken = true;
          if (!isValidToken) {
            Cookies.remove("token");
            router.replace("/pages/login");
          } else {
            // in case you need pass some user data
            // I suppose you'll receive some of it from validation request
            const userData = {
              name: "test user",
            };
            if (userData.name === "") {
              router.replace("/pages/login");
              Cookies.remove("token");
            } else {
              setUser(userData);
              setAuthenticated(true);
            }
          }
        }
        setLoading(false);
      };
      checkToken();
    }, []);

    if (loading) {
      return <CircularProgress />;
    }

    if (authenticated) {
      return <Component {...props} user={user} />;
    } else {
      return <CircularProgress />;
    }
  };
};

export default authRoute;
