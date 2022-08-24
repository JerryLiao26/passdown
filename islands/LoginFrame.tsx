/** @jsx h */
import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

export default function LoginFrame() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const checkUserLogin = async () => {
    const resp = await fetch("/api/user/login");
    const respJson = await resp.json();
    if (respJson.success) {
      // Redirect to main page if valid
      location.href = "/";
      return true;
    }
    return false;
  };

  const doUserLogin = async () => {
    const resp = await fetch("/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const respJson = await resp.json();
    if (respJson.success) {
      location.href = "/";
      return true;
    }
    return false;
  };

  useEffect(() => {
    checkUserLogin();
  }, []);

  const onSubmit = () => {
    if (email && password) {
      doUserLogin();
    }
  };

  return (
    <div className="pd-login-frame">
      <span className="pd-login-input-label">Email</span>
      <input
        className="pd-login-input"
        type="text"
        placeholder="Your email"
        value={email}
        onInput={(e) => {
          setEmail((e.target as HTMLInputElement).value);
        }}
      />
      <span className="pd-login-input-label">Password</span>
      <input
        className="pd-login-input"
        type="password"
        placeholder="Your password"
        value={password}
        onInput={(e) => {
          setPassword((e.target as HTMLInputElement).value);
        }}
      />
      <button className="pd-login-btn" type="button" onClick={onSubmit}>
        Sign in
      </button>
    </div>
  );
}
