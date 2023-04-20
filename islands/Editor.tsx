/** @jsx h */
import { h, render } from "preact";
import { useEffect, useState, useRef } from "preact/hooks";
import showdown, { Converter } from "showdown";
import { debounce, DebouncedFunction } from "$async/debounce.ts";
import { hideLoading } from "utils/ui.ts";

export enum EditorMode {
  Edit,
  Read,
  Both,
}

interface EditorProps {
  id: number;
  title: string;
  content: string;
  allowMode: EditorMode;
}

let shadow: ShadowRoot | null = null;
let shadowRoot: HTMLDivElement | null = null;
let converter: Converter | null = null;
let scrollingSide: EditorMode | null = null;
let debouncedOnSave: DebouncedFunction | null = null;

export default function Editor(props: EditorProps) {
  const [mode, setMode] = useState(props.allowMode);
  const [prevMode, setPrevMode] = useState(props.allowMode);
  const [displayContent, setDisplayContent] = useState("");
  const [convertedContent, setConvertedContent] = useState("");

  // DOM refs
  const readViewRef = useRef(null);
  const editViewRef = useRef(null);

  const checkSyncScroll = (scrollSide: EditorMode) => {
    if (scrollingSide && scrollingSide !== scrollSide) {
      scrollingSide = null;
      return false;
    }
    scrollingSide = scrollSide;
    return true;
  };

  // Sync scroll on both sides
  const onScroll = (scrollSide: EditorMode) => {
    // Do not trigger sync on other side
    if (!checkSyncScroll(scrollSide)) {
      return;
    }

    const currentElement =
      scrollSide === EditorMode.Read
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
        scrollSide === EditorMode.Edit
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

  // Unload listener
  const onUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
    return false;
  };

  // Save changes
  const onSave = async (content: string) => {
    addEventListener("beforeunload", onUnload);

    // Send request
    await fetch("/api/post", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: props.id,
        title: props.title,
        content,
      }),
    });

    // Remove listener
    removeEventListener("beforeunload", onUnload);
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
      (props.allowMode === e.detail || props.allowMode === EditorMode.Both)
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

  // Record previous state
  // Note: cannot access latest state at global function
  useEffect(() => {
    // Sync scroll when switched to both mode
    if (mode === EditorMode.Both && prevMode !== EditorMode.Both) {
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
    if (props.title) {
      setDisplayContent(props.content);
      convertText(props.content);
      hideLoading();
    }
  }, [props.title]);

  const convertText = (text: string) => {
    // Init converter
    if (!converter) {
      converter = new showdown.Converter();
    }

    // Save display text
    setDisplayContent(text);

    // Convert text
    setConvertedContent(converter.makeHtml(text));

    // Trigger save
    if (text !== props.content) {
      if (!debouncedOnSave) {
        debouncedOnSave = debounce(onSave, 2000);
      }
      debouncedOnSave(text);
    }
  };

  const getModeText = (mode: EditorMode) => {
    switch (mode) {
      case EditorMode.Read:
        return "read";
      case EditorMode.Edit:
        return "edit";
      case EditorMode.Both:
        return "both";
    }
  };

  return (
    <div className={`pd-editor pd-mode-${getModeText(mode)}`}>
      {props.allowMode !== EditorMode.Read ? (
        <div className="pd-edit-view" ref={editViewRef}>
          <textarea
            placeholder="Some Markdown here"
            onScroll={() => {
              onScroll(EditorMode.Edit);
            }}
            onPaste={() => {
              // Sync scroll again after render
              setTimeout(() => {
                onScroll(EditorMode.Edit);
              }, 100);
            }}
            onInput={(e) => {
              convertText((e.target as HTMLInputElement).value);
            }}
            value={displayContent}
          />
        </div>
      ) : null}
      {props.allowMode !== EditorMode.Edit ? (
        <div
          className="pd-read-view"
          ref={readViewRef}
          onScroll={() => {
            onScroll(EditorMode.Read);
          }}
        />
      ) : null}
    </div>
  );
}
