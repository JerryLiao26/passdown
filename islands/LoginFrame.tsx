/** @jsx h */
import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { showLoading, hideLoading } from "utils/ui.ts";

export default function LoginFrame() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

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

  const onSubmit = async () => {
    showLoading();
    if (email && password) {
      await doUserLogin();
    }

    // Set error
    if (!email) {
      setEmailError(true);
    }
    if (!password) {
      setPasswordError(true);
    }
    hideLoading();
  };

  return (
    <div className="pd-login-frame">
      <span className="pd-login-input-label">Email</span>
      <input
        className={`pd-login-input${emailError ? " error" : ""}`}
        type="text"
        placeholder="Your email"
        value={email}
        onInput={(e) => {
          setEmailError(false);
          setEmail((e.target as HTMLInputElement).value);
        }}
      />
      <span className="pd-login-input-label">Password</span>
      <input
        className={`pd-login-input${passwordError ? " error" : ""}`}
        type="password"
        placeholder="Your password"
        value={password}
        onInput={(e) => {
          setPasswordError(false);
          setPassword((e.target as HTMLInputElement).value);
        }}
      />
      <button className="pd-login-btn" type="button" onClick={onSubmit}>
        Sign in
      </button>
    </div>
  );
}
