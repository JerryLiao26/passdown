/** @jsx h */
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { EditorMode } from "./Editor.tsx";

interface TopBarProps {
  allowMode: EditorMode;
  isLogined: boolean;
}

export default function TopBar(props: TopBarProps) {
  const [mode, setMode] = useState(props.allowMode);

  // Event listener
  const modeChangeListener = (e: CustomEvent) => {
    if (
      e.detail &&
      (props.allowMode === e.detail || props.allowMode === EditorMode.Both)
    ) {
      setMode(e.detail);
    }
  };

  // Event dispatche
  const modeChangeDispatcher = (mode: string) => {
    dispatchEvent(new CustomEvent("ModeChange", { detail: mode }));
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

  const goHome = () => {
    location.href = "/";
  };

  // Init event listeners
  useEffect(() => {
    addEventListener("ModeChange", modeChangeListener);

    return () => {
      removeEventListener("ModeChange", modeChangeListener);
    };
  }, []);

  return (
    <div className="pd-top-bar">
      <div className="pd-top-bar-mode-switcher">
        <button
          className={`pd-top-bar-btn${
            mode === EditorMode.Edit ? " active" : ""
          }${props.allowMode === EditorMode.Read ? " disabled" : ""}`}
          id="edit"
          type="button"
          onClick={() => {
            modeChangeDispatcher("edit");
          }}
        >
          Edit
        </button>
        <button
          className={`pd-top-bar-btn${
            mode === EditorMode.Read ? " active" : ""
          }${props.allowMode === EditorMode.Edit ? " disabled" : ""}`}
          id="read"
          type="button"
          onClick={() => {
            modeChangeDispatcher("read");
          }}
        >
          Read
        </button>
        <button
          className={`pd-top-bar-btn${
            mode === EditorMode.Both ? " active" : ""
          }${props.allowMode !== EditorMode.Both ? " disabled" : ""}`}
          id="both"
          type="button"
          onClick={() => {
            modeChangeDispatcher("both");
          }}
        >
          Both
        </button>
      </div>
      {props.isLogined ? (
        <div className="pd-top-bar-tool-icons">
          <i className="bi bi-box-arrow-left" onClick={doLogout} />
          <i className="bi bi-house-door" onClick={goHome} />
          <i className="bi bi-share" />
          <i className="bi bi-gear" />
        </div>
      ) : null}
    </div>
  );
}
