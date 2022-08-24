/** @jsx h */
import { h, render } from "preact";
import { useEffect, useState, useRef } from "preact/hooks";
import showdown, { Converter } from "showdown";
import { showLoading, hideLoading } from "utils/ui.ts";

interface EditorProps {
  id: string;
  allowMode: "edit" | "read" | "both";
}

let shadow: ShadowRoot | null = null;
let shadowRoot: HTMLDivElement | null = null;
let converter: Converter | null = null;
let scrollingSide: "edit" | "read" | null = null;
export default function Editor(props: EditorProps) {
  const [mode, setMode] = useState(props.allowMode);
  const [prevMode, setPrevMode] = useState(props.allowMode);
  const [displayContent, setDisplayContent] = useState("");
  const [convertedContent, setConvertedContent] = useState("");

  // DOM refs
  const readViewRef = useRef(null);
  const editViewRef = useRef(null);

  const checkSyncScroll = (scrollSide: "edit" | "read") => {
    if (scrollingSide && scrollingSide !== scrollSide) {
      scrollingSide = null;
      return false;
    }
    scrollingSide = scrollSide;
    return true;
  };

  // Sync scroll on both sides
  const onScroll = (scrollSide: "edit" | "read") => {
    // Do not trigger sync on other side
    if (!checkSyncScroll(scrollSide)) {
      return;
    }

    const currentElement =
      scrollSide === "read"
        ? readViewRef.current
        : editViewRef.current &&
          (editViewRef.current as HTMLDivElement).querySelector("textarea");
    if (currentElement) {
      const currentScrollPosition = (currentElement as HTMLDivElement)
        .scrollTop;
      const currentScrollHeight =
        (currentElement as HTMLDivElement).scrollHeight -
        (currentElement as HTMLDivElement).clientHeight;

      // Sync scroll ratio
      const syncElement =
        scrollSide === "read"
          ? editViewRef.current &&
            (editViewRef.current as HTMLDivElement).querySelector("textarea")
          : readViewRef.current;
      if (syncElement) {
        (syncElement as HTMLDivElement).scrollTop =
          ((syncElement as HTMLDivElement).scrollHeight -
            (syncElement as HTMLDivElement).clientHeight) *
          (currentScrollPosition / currentScrollHeight);
      }
    }
  };

  // Render converted content to shadow root
  const renderContentToShadow = () => {
    if (readViewRef && readViewRef.current) {
      if (!shadow) {
        shadow = (readViewRef.current as HTMLDivElement).attachShadow({
          mode: "open",
        });
      }
      if (!shadowRoot) {
        shadowRoot = document.createElement("div");
        shadowRoot.id = "shadow-root";
        shadow?.appendChild(shadowRoot);
      }
      render(
        <div dangerouslySetInnerHTML={{ __html: convertedContent }} />,
        shadowRoot
      );
    }
  };

  // Event listener
  const modeChangeListener = (e: CustomEvent) => {
    if (
      e.detail &&
      (props.allowMode === e.detail || props.allowMode === "both")
    ) {
      setMode(e.detail);
    }
  };

  // Init event listeners
  useEffect(() => {
    showLoading();
    addEventListener("ModeChange", modeChangeListener);

    return () => {
      removeEventListener("ModeChange", modeChangeListener);
    };
  }, []);

  // Record previous state
  // Note: cannot access latest state at global function
  useEffect(() => {
    // Sync scroll when switched to both mode
    if (mode === "both" && prevMode !== "both") {
      onScroll(prevMode);
    }
    setPrevMode(mode);
  }, [mode]);

  // Re-render when converted content changes
  useEffect(() => {
    renderContentToShadow();
  }, [convertedContent, readViewRef]);

  // Init conversion
  useEffect(() => {
    const loadPost = async () => {
      if (props.id) {
        const resp = await fetch("/api/post");
        const respJson = await resp.json();
        if (respJson.success) {
          setDisplayContent(respJson.data);
          convertText(respJson.data);
          hideLoading();
        }
      }
    };
    loadPost();
  }, [props.id]);

  const convertText = (text: string) => {
    // Init converter
    if (!converter) {
      converter = new showdown.Converter();
    }

    // Save display text
    setDisplayContent(text);

    // Convert text and save
    setConvertedContent(converter.makeHtml(text));
  };

  return (
    <div className={`pd-editor pd-mode-${mode}`}>
      {props.allowMode !== "read" ? (
        <div className="pd-edit-view" ref={editViewRef}>
          <textarea
            placeholder="Some Markdown here"
            onScroll={() => {
              onScroll("edit");
            }}
            onPaste={() => {
              // Sync scroll again after render
              setTimeout(() => {
                onScroll("edit");
              }, 100);
            }}
            onInput={(e) => {
              convertText((e.target as HTMLInputElement).value);
            }}
            value={displayContent}
          />
        </div>
      ) : null}
      {props.allowMode !== "edit" ? (
        <div
          className="pd-read-view"
          ref={readViewRef}
          onScroll={() => {
            onScroll("read");
          }}
        />
      ) : null}
    </div>
  );
}
