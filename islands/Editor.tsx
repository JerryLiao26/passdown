/** @jsx h */
import { h, render } from "preact";
import { useEffect, useState, useRef } from "preact/hooks";
import showdown, { Converter } from "showdown";

interface EditorProps {
  content: string;
  allowMode: "edit" | "read" | "both";
}

let shadow: ShadowRoot | null = null;
let shadowRoot: HTMLDivElement | null = null;
let converter: Converter | null = null;
export default function Editor(props: EditorProps) {
  const [mode, setMode] = useState(props.allowMode);
  const [displayContent, setDisplayContent] = useState("");
  const [convertedContent, setConvertedContent] = useState("");

  // DOM to contain shadow root
  const shadowRootRef = useRef(null);

  // Render converted content to shadow root
  const renderContentToShadow = () => {
    if (shadowRootRef && shadowRootRef.current) {
      if (!shadow) {
        shadow = (shadowRootRef.current as HTMLDivElement).attachShadow({
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
    addEventListener("ModeChange", modeChangeListener);

    return () => {
      removeEventListener("ModeChange", modeChangeListener);
    };
  }, []);

  // Re-render when converted content changes
  useEffect(() => {
    renderContentToShadow();
  }, [convertedContent, shadowRootRef]);

  // Init conversion
  useEffect(() => {
    if (props.content) {
      convertText(props.content);
    }
  }, [props.content]);

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
        <div className="pd-edit-view">
          <textarea
            placeholder="Some Markdown here"
            onInput={(e) => {
              convertText((e.target as HTMLInputElement).value);
            }}
            value={displayContent}
          />
        </div>
      ) : null}
      {props.allowMode !== "edit" ? (
        <div className="pd-read-view" ref={shadowRootRef} />
      ) : null}
    </div>
  );
}
