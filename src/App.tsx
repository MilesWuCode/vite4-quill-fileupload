import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QuillEditor from "./components/QuillEditor";
import debounce from "lodash.debounce";

function App() {
  const [value, setValue] = useState("");

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const debouncedChangeHandler = useMemo(() => debounce(handleChange, 300), []);

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, []);

  function createMarkup() {
    return { __html: value };
  }

  return (
    <div className="App">
      <QuillEditor defaultValue={value} onChange={debouncedChangeHandler} />
      <hr />
      <div dangerouslySetInnerHTML={createMarkup()}></div>
      <hr />
      <div>{value}</div>
    </div>
  );
}

export default App;
