/** @jsx h */
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import showdown, { Converter } from "showdown";

interface EditorProps {
  content: string;
  allowMode: "edit" | "read" | "both";
}

let converter: Converter | null = null;
export default function Editor(props: EditorProps) {
  const [mode, setMode] = useState(props.allowMode);
  const [displayContent, setDisplayContent] = useState("");
  const [convertedContent, setConvertedContent] = useState("");

  // Event listener
  const modeChangeListener = (e: CustomEvent) => {
    if (e.detail && props.allowMode === "both") {
      setMode(e.detail);
    }
  };

  // Init event listeners
  useEffect(() => {
    window.addEventListener("ModeChange", modeChangeListener);

    return () => {
      window.removeEventListener("ModeChange", modeChangeListener);
    };
  }, []);

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
      {mode !== "read"
        ? (
          <div className="pd-edit-view">
            <textarea
              placeholder="Some Markdown here"
              onInput={(e) => {
                convertText((e.target as HTMLInputElement).value);
              }}
              value={displayContent}
            />
          </div>
        )
        : null}
      {mode !== "edit"
        ? (
          <div
            className="pd-read-view"
            dangerouslySetInnerHTML={{ __html: convertedContent }}
          />
        )
        : null}
    </div>
  );
}
