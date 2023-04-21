import Cookies from 'js-cookie';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import { API_BASE_URL } from './config';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname; // relative path

  // Manage route protection
  const token = Cookies.get('token')
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login");
  // let user;


  console.log(token, "token");
  //   if (adminRoute.includes(pathname)) {
  //     if (user.role) {
  //       router.push(pathname)
  //     } else {
  //       router.push('/')
  //     }
  //   }

  // const handleGetUser = async (token: string) => {
  //   const userData = await fetch(`${API_BASE_URL}/users/role`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   }) as unknown
    
  //   console.log(pathname, "pathname");
  //   console.log(userData, "userData");
  //   user = userData;
  // }

  // if(token) handleGetUser(token)
  

  const adminRoutes = ["/global-administrator/", "/global-administrator/users/", "/global-administrator/unactive-accounts/"];

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return null;
  }

  console.log(pathname);

  if (
    !isAuth &&
    adminRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

}


export const config = {
  matcher: ["/", "/login", "//global-administrator", "/global-administrator/:path*"],
};