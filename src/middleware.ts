import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/confirmAge")) {
    const response = NextResponse.next();
    response.cookies.set("ageVerify", "true");
    return response;
  }
}
