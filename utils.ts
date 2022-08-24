import { setCookie, getCookies, deleteCookie } from "$http/cookie.ts";

export function checkToken(req: Request) {
  const cookies = getCookies(req.headers);
  console.log("DIOR::", cookies);
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

export function showLoading() {
  if (document && document.body) {
    const coverEle = document.body.querySelector(".pd-cover");
    if (!coverEle) {
      const newCoverEle = document.createElement("div");
      newCoverEle.className = "pd-cover";
      newCoverEle.style.position = "fixed";
      newCoverEle.style.top = "0";
      newCoverEle.style.left = "0";
      newCoverEle.style.right = "0";
      newCoverEle.style.bottom = "0";
      newCoverEle.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      newCoverEle.style.zIndex = "9";
      document.body.appendChild(newCoverEle);
    }
  }
}

export function hideLoading() {
  if (document && document.body) {
    const coverEle = document.body.querySelector(".pd-cover");
    if (coverEle) {
      document.body.removeChild(coverEle);
    }
  }
}
