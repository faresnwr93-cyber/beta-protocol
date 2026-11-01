import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getDiscordConfig } from "@/lib/config";
import { baseCookieOptions, oauthStateCookieName } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const config = getDiscordConfig();
    const secret = process.env.NEXTAUTH_SECRET?.trim();
    if (!secret || secret.length < 32) throw new Error("invalid_session_secret");

    const state = randomBytes(32).toString("base64url");
    const authorization = new URL("https://discord.com/oauth2/authorize");
    authorization.searchParams.set("client_id", config.clientId);
    authorization.searchParams.set("response_type", "code");
    authorization.searchParams.set("redirect_uri", config.redirectUri);
    authorization.searchParams.set("scope", "identify guilds.join");
    authorization.searchParams.set("state", state);
    authorization.searchParams.set("prompt", "consent");

    const response = NextResponse.redirect(authorization);
    response.cookies.set(oauthStateCookieName(), state, baseCookieOptions());
    return response;
  } catch {
    return NextResponse.redirect(new URL("/resultat?erreur=configuration", request.url));
  }
}
