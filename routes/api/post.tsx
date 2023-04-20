import { Handlers } from "$fresh/server.ts";
import {
  checkToken,
  makeErrorResponse,
  makeSuccessResponse,
} from "utils/server.ts";
import { del, find, insert, update } from "utils/db.ts";

export const handler: Handlers = {
  async GET(req: Request) {
    const reqJson = await req.json();
    const id = reqJson.id;
    const tokenUserId = checkToken(req);
    if (id) {
      const post = find(
        "Post",
        tokenUserId
          ? {
              id,
              user_id: tokenUserId,
            }
          : {
              id,
              shared: true,
            },
        ["title", "content"]
      );
      if (post.length > 0) {
        return makeSuccessResponse({
          title: post[0][0] as string,
          content: post[0][1] as string,
        });
      }
    }
    return makeErrorResponse();
  },
  async POST(req: Request) {
    const reqJson = await req.json();
    const title = reqJson.title || "";
    const content = reqJson.content || "";
    const tokenUserId = checkToken(req);
    if (tokenUserId) {
      const post = insert("Post", {
        title,
        content,
        user_id: tokenUserId,
        shared: false,
      });
      if (post.length > 0) {
        return makeSuccessResponse(post[0][0] as string);
      }
    }
    return makeErrorResponse();
  },
  async PUT(req: Request) {
    const reqJson = await req.json();
    const id = reqJson.id;
    const title = reqJson.title;
    const content = reqJson.content;
    const tokenUserId = checkToken(req);
    if (tokenUserId && id && title && content) {
      const post = find("Post", {
        id,
        user_id: tokenUserId,
      });
      if (post.length > 0) {
        const newPost = update("Post", id, {
          title,
          content,
        });
        if (newPost.length > 0) {
          return makeSuccessResponse(true);
        }
      }
    }
    return makeErrorResponse();
  },
  async DELETE(req: Request) {
    const reqJson = await req.json();
    const id = reqJson.id;
    const tokenUserId = checkToken(req);
    if (tokenUserId && id) {
      const post = del("Post", {
        id,
        user_id: tokenUserId,
      });
      if (post.length > 0) {
        return makeSuccessResponse(true);
      }
    }
    return makeErrorResponse();
  },
};
