/** @jsx h */
import { h } from "preact";
import TopBar from "../islands/TopBar.tsx";
import Editor from "../islands/Editor.tsx";

export default function Home() {
  return (
    <div className="pd-page">
      <TopBar allowMode="both" />
      <Editor id="id" allowMode="both" />
    </div>
  );
}
