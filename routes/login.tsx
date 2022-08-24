/** @jsx h */
import { h } from "preact";
import LoginFrame from "../islands/LoginFrame.tsx";

export default function Login() {
  return (
    <div className="pd-page pd-page-centered">
      <h2>Sign in to Postdown</h2>
      <LoginFrame />
    </div>
  );
}
