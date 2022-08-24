import { Handlers } from "$fresh/server.ts";
import {
  checkToken,
  makeErrorResponse,
  makeSuccessResponse,
} from "../../utils.ts";

export const handler: Handlers = {
  async GET(req: Request) {
    // Mock post content
    if (checkToken(req)) {
      const resp = await fetch(
        "https://raw.githubusercontent.com/denoland/deno/main/README.md"
      );
      if (resp.status === 200) {
        return makeSuccessResponse(await resp.text());
      }
    }
    return makeErrorResponse();
  },
};
