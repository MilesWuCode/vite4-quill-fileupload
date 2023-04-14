import { useState } from "react";
import QuillEditor from "./components/QuillEditor";

function App() {
  const [value, setValue] = useState("<h1>Title</h1>");

  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className="App">
      <QuillEditor defaultValue={value} onChange={onChange} />
      <hr />
      <p>{value}</p>
    </div>
  );
}

export default App;
