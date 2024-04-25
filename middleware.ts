// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { NextURL } from 'next/dist/server/web/next-url';

const basicCookieCheck = (request: NextRequest) =>
  request.cookies?.get('userToken') ? true : false;

const makeLoginUrl = (request: NextRequest) => {
  const url: NextURL = request.nextUrl.clone();
  url.pathname = `/public/login`;
  return url;
};

const isAuthenticatedPath = (request: NextRequest) => {
  const pathParts = request.nextUrl.pathname.split('/');
  return pathParts[1] == 'private';
};

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  if (isAuthenticatedPath(request) && !basicCookieCheck(request)) {
    return NextResponse.redirect(makeLoginUrl(request));
  }
  return NextResponse.next();
}
