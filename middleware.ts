import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const step = request.cookies.get("reg_step")?.value;
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  // منع دخول verify-otp
//   if (path.startsWith("/verify-otp") && step !== "register_started") {
//     return NextResponse.redirect(new URL("/register", request.url));
//   }

  // منع دخول complete-register
  if (
    path.startsWith("/register/complete-register") &&
    step !== "otp_verified"
  ) {
    return NextResponse.redirect(new URL("/register", request.url));
  }

  // منع دخول dashboard
  if (path.startsWith("/dashboard") && step !== "profile_completed") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
