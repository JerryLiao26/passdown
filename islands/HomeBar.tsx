/** @jsx h */
import { h } from "preact";
import { showLoading } from "utils/ui.ts";

interface HomeBarProps {
  name: string;
}

export default function HomeBar(props: HomeBarProps) {
  const doNewPost = async () => {
    showLoading();
    const resp = await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "",
        content: "",
      }),
    });
    const respJson = await resp.json();
    if (respJson.success) {
      location.href = `/post/${respJson.data}`;
      return true;
    }
    return false;
  };

  const doLogout = async () => {
    const resp = await fetch("/api/user/logout");
    const respJson = await resp.json();
    if (respJson.success) {
      location.href = "/login";
      return true;
    }
    return false;
  };

  return (
    <div className="pd-home-bar">
      <button onClick={doNewPost}>New Post</button>
      <div className="pd-home-user-info">
        <span>{props.name}</span>
        <button onClick={doLogout}>Logout</button>
      </div>
    </div>
  );
}
