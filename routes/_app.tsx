/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { asset, Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/server.ts";

export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <link href={asset("/global.css")} rel="stylesheet" />
        <link
          href="https://www.unpkg.com/bootstrap-icons@1.10.4/font/bootstrap-icons.css"
          rel="stylesheet"
        />
      </Head>
      <props.Component />
    </>
  );
}
