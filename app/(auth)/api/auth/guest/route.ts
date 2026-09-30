import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { signIn } from "@/app/(auth)/auth";
import { isDevelopmentEnvironment } from "@/lib/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawRedirect = searchParams.get("redirectUrl") || "/";
  let redirectUrl = "/";

  try {
    const candidate = new URL(rawRedirect, request.url);
    const requestOrigin = new URL(request.url).origin;

    if (candidate.origin === requestOrigin) {
      redirectUrl =
        candidate.pathname + candidate.search + candidate.hash;
    }
  } catch {
    // Keep the safe root fallback for malformed redirect URLs.
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  if (token) {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    return NextResponse.redirect(new URL(`${base}/`, request.url));
  }

  return signIn("guest", { redirect: true, redirectTo: redirectUrl });
}
