import React, { useEffect, useRef, useState } from "react";
import Quill, { QuillOptionsStatic } from "quill";
import "quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
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
      Quill.register("modules/imageUploader", ImageUploader);

      const newEditor = new Quill(editorRef.current, {
        modules: {
          toolbar: toolbarOptions,
          imageUploader: {
            upload: (file: File) => {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve(
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/480px-JavaScript-logo.png"
                  );
                }, 3500);
              });
            },
          },
        },
        formats: formats,
        theme: "snow",
      } as QuillOptionsStatic);

      // 預設值
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

  return <div style={{ height: "600px" }} ref={editorRef} />;
}

export default QuillEditor;
