import { Handlers } from "$fresh/server.ts";
import {
  setToken,
  checkToken,
  makeErrorResponse,
  makeSuccessResponse,
  getCryptoString,
} from "utils/server.ts";
import { find, insert } from "utils/db.ts";

export const handler: Handlers = {
  GET(req: Request) {
    const tokenUserId = checkToken(req);
    if (tokenUserId) {
      const user = find(
        "User",
        {
          id: tokenUserId,
        },
        ["name", "email"]
      );
      if (user.length > 0) {
        return makeSuccessResponse({
          name: user[0][0] as string,
          email: user[0][1] as string,
        });
      }
    }
    return makeErrorResponse();
  },
  async POST(req: Request) {
    const reqJson = await req.json();
    if (reqJson.email && reqJson.password) {
      const user = find(
        "User",
        {
          email: reqJson.email,
        },
        ["id"]
      );
      if (user.length > 0) {
        // Generate token
        const token = await getCryptoString(
          reqJson.email + new Date().toString(),
          "MD5"
        );

        // Store token
        const newToken = insert("Token", {
          token,
          user_id: user[0][0] as string,
        });
        if (newToken.length > 0) {
          const successResponse = makeSuccessResponse(true);
          setToken(successResponse, token);
          return successResponse;
        }
      }
    }
    return makeErrorResponse();
  },
};
