import React, { useState } from 'react';

function useInput({ type, defaultValue }) {
  const [value, setValue] = useState(defaultValue||"");
  const input = <input value={value} onChange={e => setValue(e.target.value)} type={type} />;
  return [value, input, setValue];
}

export default useInput