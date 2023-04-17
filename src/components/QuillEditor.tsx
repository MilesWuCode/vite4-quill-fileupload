import React, { useEffect, useRef } from "react";
import Quill, { QuillOptionsStatic, RangeStatic } from "quill";
import "quill/dist/quill.snow.css";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block", "image"],

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

interface QuillEditorProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

function QuillEditor({ defaultValue, onChange }: QuillEditorProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const editorRef = useRef<Quill | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (divRef.current) {
      // Quill初始化
      let quill = new Quill(divRef.current, {
        modules: {
          toolbar: toolbarOptions,
        },
        placeholder: "input text.",
        theme: "snow",
      } as QuillOptionsStatic);

      // 預設值
      quill.clipboard.dangerouslyPasteHTML(defaultValue || "");

      // 取得toolbar物件
      const toolbar = quill.getModule("toolbar");

      // 填加事件
      toolbar.addHandler("image", () => {
        fileInputRef.current?.click();
      });

      // 存入Ref
      editorRef.current = quill;
    }
  }, []);

  useEffect(() => {
    // 修改值
    if (editorRef.current && onChange) {
      editorRef.current.on("text-change", (delta, oldDelta, source) => {
        onChange(editorRef.current?.root.innerHTML || "");
      });
    }
  }, [editorRef, onChange]);

  const handleFileInput = () => {
    const fileInput = fileInputRef.current;

    const file = fileInput?.files?.[0];

    if (file) {
      // 上傳檔案
      uploadFile(file).then((url) => {
        // 插入圖片
        const range = editorRef.current?.getSelection() as RangeStatic;

        editorRef.current?.insertEmbed(range.index, "image", url);
      });
    }
  };

  // 範例
  const uploadFile = (file: File): Promise<string> => {
    // 模擬上傳到伺服器
    return new Promise((resolve) => {
      setTimeout(() => {
        let reader = new FileReader();

        reader.onloadend = () => {
          resolve(reader.result as string);
        };

        reader.readAsDataURL(file);
      }, 1000);
    });
  };

  return (
    <>
      <div style={{ height: "200px" }} ref={divRef} />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileInput}
      />
    </>
  );
}

export default QuillEditor;
