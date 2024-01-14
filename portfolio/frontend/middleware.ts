import { NextRequest, NextResponse } from "next/server";
import { protectedRoutes } from "./router/routes";

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("token")?.value;
    if (!protectedRoutes.includes(request.nextUrl.pathname)) {
        return NextResponse.next();
    }
    if (!accessToken) {
        return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
    }
}
