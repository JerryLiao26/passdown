/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { showLoading, hideLoading } from "utils/ui.ts";

interface LoginFrameProps {
  mode: "login" | "register";
}

export default function LoginFrame(props: LoginFrameProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

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

  const doUserRegister = async () => {
    const resp = await fetch("/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const respJson = await resp.json();
    if (respJson.success) {
      location.href = "/login";
      return true;
    }
    return false;
  };

  useEffect(() => {
    props.mode === "login" && checkUserLogin();
  }, []);

  const onSubmit = async () => {
    showLoading();

    // Do request
    if (email && password && props.mode === "login") {
      await doUserLogin();
    } else if (
      email &&
      password &&
      confirmPassword &&
      props.mode === "register"
    ) {
      if (password !== confirmPassword) {
        setConfirmPasswordError(true);
      } else {
        await doUserRegister();
      }
    }

    // Set error
    if (!email) {
      setEmailError(true);
    }
    if (!password) {
      setPasswordError(true);
    }
    if (!confirmPassword && props.mode === "register") {
      setConfirmPasswordError(true);
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
      {props.mode === "register" ? (
        <>
          <span className="pd-login-input-label">Confirm Password</span>
          <input
            className={`pd-login-input${confirmPasswordError ? " error" : ""}`}
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onInput={(e) => {
              setConfirmPasswordError(false);
              setConfirmPassword((e.target as HTMLInputElement).value);
            }}
          />
        </>
      ) : null}
      <button className="pd-login-btn" type="button" onClick={onSubmit}>
        {props.mode === "register" ? "Register" : "Sign in"}
      </button>
    </div>
  );
}
