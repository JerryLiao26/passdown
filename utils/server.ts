import { setCookie, getCookies, deleteCookie } from "$http/cookie.ts";

export function checkToken(req: Request) {
  const cookies = getCookies(req.headers);
  if (cookies && cookies["pd-user-token"]) {
    return true;
  }
  return false;
}

export function setToken(res: Response) {
  setCookie(res.headers, {
    name: "pd-user-token",
    value: "testTEST123!@#",
    path: "/",
  });
}

export function clearToken(res: Response) {
  deleteCookie(res.headers, "pd-user-token");
}

export function makeSuccessResponse(
  data: Record<string, unknown> | string | number | boolean
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
