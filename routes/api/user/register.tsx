import { Handlers } from "$fresh/server.ts";
import {
  makeErrorResponse,
  makeSuccessResponse,
  getCryptoString,
} from "utils/server.ts";
import { find, insert } from "utils/db.ts";

export const handler: Handlers = {
  async POST(req: Request) {
    const reqJson = await req.json();
    if (reqJson.email && reqJson.password) {
      const user = find("User", {
        email: reqJson.email,
      });
      if (user.length === 0) {
        const newUser = insert("User", {
          name: reqJson.email.split("@")[0],
          email: reqJson.email,
          password: await getCryptoString(reqJson.password, "MD5"),
        });
        if (newUser.length > 0) {
          return makeSuccessResponse(true);
        }
      }
    }
    return makeErrorResponse();
  },
};
