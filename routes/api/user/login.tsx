import { Handlers } from "$fresh/server.ts";
import {
  checkToken,
  makeErrorResponse,
  makeSuccessResponse,
  setToken,
} from "../../../utils.ts";

export const handler: Handlers = {
  GET(req: Request) {
    // Mock a default user
    if (checkToken(req)) {
      return makeSuccessResponse({
        name: "Jerry Liao",
        email: "jerryliao26@gmail.com",
      });
    }
    return makeErrorResponse();
  },
  async POST(req: Request) {
    const reqJson = await req.json();
    if (reqJson.email && reqJson.password) {
      const successResponse = makeSuccessResponse(true);
      setToken(successResponse);
      return successResponse;
    }
    return makeErrorResponse();
  },
};
