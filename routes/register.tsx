/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { Head } from "$fresh/runtime.ts";
import LoginFrame from "../islands/LoginFrame.tsx";

export default function Register() {
  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <div className="pd-page pd-page-centered">
        <h2>Register to Postdown</h2>
        <LoginFrame mode="register" />
      </div>
    </>
  );
}
