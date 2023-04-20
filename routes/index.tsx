/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { checkToken } from "utils/server.ts";
import { find } from "utils/db.ts";
import HomeBar from "../islands/HomeBar.tsx";
import PostList from "../islands/PostList.tsx";

interface HomeProps {
  name: string;
  list: { id: number; title: string; content: string; shared: boolean }[];
}

export const handler: Handlers<HomeProps> = {
  GET(req, ctx) {
    const tokenUserId = checkToken(req);
    if (tokenUserId) {
      const user = find(
        "User",
        {
          id: tokenUserId,
        },
        ["name"]
      );
      if (user.length > 0) {
        const posts = find("Post", { user_id: tokenUserId }, [
          "id",
          "title",
          "content",
          "shared",
        ]);
        return ctx.render({
          name: user[0][0] as string,
          list: posts.map((post) => ({
            id: post[0] as string,
            title: post[1] as string,
            content: post[2] as string,
            shared: post[3] as boolean,
          })),
        });
      }
    }
    // Redirect to login page if not valid
    const headers = new Headers();
    headers.set("location", "/login");
    return new Response(null, {
      status: 303, // See Other
      headers,
    });
  },
};

export default function Home(props: PageProps<HomeProps>) {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className="pd-page">
        <HomeBar name={props.data.name} />
        <PostList posts={props.data.list} />
      </div>
    </>
  );
}
