import { useCallback, useRef, useState } from "react";
import QuillEditor from "./components/QuillEditor";

function App() {
  const [value, setValue] = useState("");

  const debounceRef = useRef(0);

  const handleChange = useCallback((newValue: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      console.log(newValue);
      setValue(newValue);
    }, 400);
  }, []);

  function createMarkup() {
    return { __html: value };
  }

  return (
    <div className="App">
      <QuillEditor defaultValue={value} onChange={handleChange} />
      <hr />
      <div dangerouslySetInnerHTML={createMarkup()}></div>
    </div>
  );
}

export default App;
