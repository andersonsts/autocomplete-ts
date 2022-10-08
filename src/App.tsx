import { useState } from "react";

import Autocomplete from "components/Autocomplete";
import { callDataExample } from "api";

function App() {
  const [selectedOption, setSelectedOption] = useState('')

  return (
    <main>
      <Autocomplete
        callData={callDataExample}
        onGetSelectedValue={setSelectedOption}
      />
      {!!selectedOption.trim() && (
        <pre>
          Selected value: <b>{selectedOption}</b>
        </pre>
      )}
    </main>
  );
}

export default App;
