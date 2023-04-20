/** @jsx h */
import { h } from "preact";
import { UnknownPageProps } from "$fresh/server.ts";

export default function NotFound(props: UnknownPageProps) {
  return (
    <div className="pd-page pd-page-centered">
      Not Found: {props.url.pathname}
    </div>
  );
}
