import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // TODO: Create middleware for getting geolocation for currency (Use Headers).

  if (request.nextUrl.pathname.startsWith("/confirmAge")) {
    console.log("request", request.nextUrl.pathname);
    const response = NextResponse.next();
    response.cookies.set("ageVerify", "true");
    return response;
  }
}
