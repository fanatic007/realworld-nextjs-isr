import { NextRequest, NextResponse } from "next/server"
import stringify from 'fast-json-stable-stringify'
import { PATH_HOME } from "./constants";

export function encodeOptions(options:any) {
  const json = stringify(options)
  return encodeURI(json);
}

export function decodeOptions(path:any) {
  return JSON.parse(decodeURI(path));
}

export function middleware(request:NextRequest){
  if (request.nextUrl.pathname === PATH_HOME) {
    const searchParams = request.nextUrl.searchParams;
    const path = encodeOptions({
      tag: searchParams.get('tag'),
      page: searchParams.get('page') || '1',
    });
    const newUrl = new URL(`/home/${path}`, request.nextUrl.origin);
    return NextResponse.rewrite(newUrl)
  }
  return NextResponse.next()
}

export const config = {
  matcher: [PATH_HOME]
}