import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { API_BASE_URL } from './config';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname; // relative path

  // Manage route protection
  const token = req.cookies.get('token')
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login");

  const user = await (await fetch(`${API_BASE_URL}/users/role`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })).json()

  const userRoutes = ["/content/", "/content/view-content/", "/writing/", "/view-writing/", "/automation/", "/automation/view-automation/", "/user-management/", "/invite-team/", "/account-settings/"]
  const adminRoutes = ["/global-administrator/", "/global-administrator/users/", "/global-administrator/unactive-accounts/", "/global-administrator/invited-users/"];
  const isOpenAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isOpenUserRoute = userRoutes.some((route) => pathname.startsWith(route));

  if(isOpenUserRoute) {
    if(user?.role) {
      return NextResponse.rewrite(new URL("/global-administrator/users/", req.url))
    }
  }


  if (isOpenAdminRoute) {
    if(user?.role){
      return NextResponse.rewrite(new URL(pathname, req.url))
    }else{
      if(token){
        return NextResponse.redirect(new URL("/", req.url))
      }else{
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }
  }


  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return null;
  }


  if (!isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

}


export const config = {
  matcher: [
    "/",
    "/content", 
    "/content/view-content/", 
    "/writing/", 
    "/view-writing/", 
    "/automation/", 
    "/automation/view-automation/", 
    "/user-management/", 
    "/invite-team/", 
    "/account-settings/", 
    "/login", 
    "/global-administrator/users", 
    "/global-administrator/unactive-accounts", 
    "/global-administrator/invited-users"
  ],
};