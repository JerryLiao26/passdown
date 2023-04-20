import { crypto, toHashString, DigestAlgorithm } from "$crypto/mod.ts";
import { setCookie, getCookies, deleteCookie } from "$http/cookie.ts";
import { find } from "utils/db.ts";

export async function getCryptoString(rawString: string, cryptoMethod: string) {
  const buffer = await crypto.subtle.digest(
    cryptoMethod as DigestAlgorithm,
    new TextEncoder().encode(rawString)
  );
  return toHashString(buffer);
}

export function checkToken(req: Request) {
  const cookies = getCookies(req.headers);
  if (cookies) {
    const token = find(
      "Token",
      {
        token: cookies["pd-user-token"] || "",
      },
      ["user_id"]
    );
    if (token.length > 0) {
      return token[0][0] as string;
    }
  }
  return false;
}

export function setToken(res: Response, token: string) {
  setCookie(res.headers, {
    name: "pd-user-token",
    value: token,
    path: "/",
  });
}

export function clearToken(res: Response) {
  deleteCookie(res.headers, "pd-user-token", { path: "/" });
}

export function makeSuccessResponse(
  data:
    | Record<string, unknown>
    | Record<string, unknown>[]
    | string
    | number
    | boolean
) {
  return new Response(
    JSON.stringify({
      success: true,
      data: data,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export function makeErrorResponse() {
  return new Response(
    JSON.stringify({
      success: false,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
