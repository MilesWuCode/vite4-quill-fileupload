import React, { useEffect, useRef, useState } from "react";
import Quill, { QuillOptionsStatic } from "quill";
import "quill/dist/quill.snow.css";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  [{ header: 1 }, { header: 2 }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  // [{ align: [] }],
  ["link", "image"],
  ["clean"],
];

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

interface QuillEditorProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

function QuillEditor({ defaultValue, onChange }: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const [editor, setEditor] = useState<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const newEditor = new Quill(editorRef.current, {
        modules: {
          toolbar: toolbarOptions,
        },
        formats: formats,
        theme: "snow",
      } as QuillOptionsStatic);

      newEditor.clipboard.dangerouslyPasteHTML(defaultValue || "");

      setEditor(newEditor);
    }
  }, []);

  // useEffect(() => {
  //   if (editor && defaultValue) {
  //     editor.clipboard.dangerouslyPasteHTML(defaultValue);
  //   }
  // }, [editor, defaultValue]);

  useEffect(() => {
    if (editor) {
      editor.on("text-change", (delta, oldDelta, source) => {
        if (onChange) {
          onChange(editor.root.innerHTML);
        }
      });
    }
  }, [editor, onChange]);

  return <div style={{ height: "300px" }} ref={editorRef} />;
}

export default QuillEditor;
