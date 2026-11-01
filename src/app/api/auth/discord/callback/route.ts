import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, exchangeCode } from "@/lib/discord";
import {
  baseCookieOptions,
  oauthStateCookieName,
  oauthTicketCookieName,
  resultCookieName,
  saveOAuthTicket,
} from "@/lib/session";

export const runtime = "nodejs";

function sameState(expected: string, actual: string) {
  const left = Buffer.from(expected);
  const right = Buffer.from(actual);
  return left.length === right.length && timingSafeEqual(left, right);
}

function expireCookie(response: NextResponse, name: string) {
  response.cookies.set(name, "", { ...baseCookieOptions(), maxAge: 0 });
}

function resultRedirect(request: NextRequest, reason: string) {
  const response = NextResponse.redirect(
    new URL("/resultat?erreur=" + encodeURIComponent(reason), request.url),
  );
  expireCookie(response, oauthStateCookieName());
  expireCookie(response, oauthTicketCookieName());
  expireCookie(response, resultCookieName());
  return response;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  if (query.get("error")) return resultRedirect(request, "discord");

  const code = query.get("code");
  const state = query.get("state");
  const storedState = request.cookies.get(oauthStateCookieName())?.value;
  if (!code || !state || !storedState || !sameState(state, storedState)) {
    return resultRedirect(request, "state");
  }

  try {
    const token = await exchangeCode(code);
    const identity = await getCurrentUser(token.access_token);
    await saveOAuthTicket({
      identity,
      accessToken: token.access_token,
      expiresAt: Date.now() + Math.min(token.expires_in, 600) * 1000,
    });

    const response = NextResponse.redirect(new URL("/verification", request.url));
    expireCookie(response, oauthStateCookieName());
    expireCookie(response, resultCookieName());
    return response;
  } catch {
    return resultRedirect(request, "discord");
  }
}
