import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { API_BASE_URL } from './config';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname; // relative path
  // console.log("Middleware");

  // Manage route protection
  const token = req.cookies.get('token')
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login");
  const userRoutes = ["/", "/content/add/", "/content/view/", "/writing/add/", "/writing/view/", "/automation/add/", "/automation/view/", "/user-management/", "/invite-team/", "/account-settings/", "/product/search/", "/product/tracker/", "/content/product-details/"]
  const isOpenUserRoute = userRoutes.some((route) => pathname.startsWith(route));

  if(isOpenUserRoute){
    if(!isAuth){
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  const user = await (await fetch(`${API_BASE_URL}/users/role`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })).json()

  const adminRoutes = ["/global-administrator/", "/global-administrator/users/", "/global-administrator/unactive-accounts/", "/global-administrator/invited-users/", "/global-administrator/logs/", "/global-administrator/dropshipping/", "/global-administrator/notifications/"];
  const isOpenAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));


  if (isAuthPage) {
    if (isAuth) {
      if(user?.role){
        return NextResponse.redirect(new URL("/global-administrator/users", req.url))
      }else{
        // return NextResponse.redirect(new URL("/", req.url))
      }
    }

    return null;
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

}

export const config = {
  matcher: [
    "/",
    "/global-administrator/users", 
    "/global-administrator/unactive-accounts", 
    "/global-administrator/invited-users",
    "/content/", 
    "/content/view-content/", 
    "/writing/", 
    "/view-writing/", 
    "/automation/", 
    "/automation/view-automation/", 
    "/user-management/", 
    "/invite-team/", 
    "/account-settings/",
    "/product/search/",
    "/product/tracker/",
    "/content/product-details/",
    "/global-administrator/logs/",
    "/global-administrator/dropshipping/",
    "/global-administrator/notifications/"
  ],
};