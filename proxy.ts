import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROOT_DOMAIN = process.env.ROOT_DOMAIN ?? "localhost:3000";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const isSubdomain = host !== ROOT_DOMAIN && host.endsWith(`.${ROOT_DOMAIN}`);

  if (!isSubdomain) {
    return NextResponse.next();
  }

  const subdomain = host.slice(0, -(ROOT_DOMAIN.length + 1));
  if (subdomain === "www") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/sites/${subdomain}${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
