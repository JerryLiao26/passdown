/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { checkToken } from "utils/server.ts";
import { find } from "utils/db.ts";
import TopBar from "../../islands/TopBar.tsx";
import Editor, { EditorMode } from "../../islands/Editor.tsx";

interface PostProps {
  id: number;
  title: string;
  content: string;
  isLogined: boolean;
  allowMode: EditorMode;
}

export const handler: Handlers<PostProps> = {
  GET(req, ctx) {
    const tokenUserId = checkToken(req);
    const postId = Number(ctx.params.id);
    const post = find(
      "Post",
      tokenUserId
        ? {
            id: postId,
            user_id: tokenUserId,
          }
        : { id: postId, shared: true },
      ["title", "content"]
    );
    if (post.length > 0) {
      return ctx.render({
        id: postId,
        isLogined: Boolean(tokenUserId),
        allowMode: tokenUserId ? EditorMode.Both : EditorMode.Read,
        title: (post[0][0] as string) || "Untitled",
        content: post[0][1] as string,
      });
    }
    // Redirect to 404 page if not found
    return ctx.renderNotFound();
  },
};

export default function Post(props: PageProps) {
  return (
    <>
      <Head>
        <title>{props.data.title}</title>
      </Head>
      <div className="pd-page">
        <TopBar
          allowMode={props.data.allowMode}
          isLogined={props.data.isLogined}
        />
        <Editor
          id={props.data.id}
          title={props.data.title}
          content={props.data.content}
          allowMode={props.data.allowMode}
        />
      </div>
    </>
  );
}
