/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import TopBar from "../islands/TopBar.tsx";
import Editor from "../islands/Editor.tsx";

export default function Home() {
  const [content, setContent] = useState("##Title");

  return (
    <div className="pd-page">
      <TopBar allowMode="both" />
      <Editor content={content} allowMode="both" />
    </div>
  );
}
