import { Handlers } from "$fresh/server.ts";
import { clearToken, makeSuccessResponse } from "utils/server.ts";

export const handler: Handlers = {
  GET(_req: Request) {
    const successResponse = makeSuccessResponse(true);
    clearToken(successResponse);
    return successResponse;
  },
};
