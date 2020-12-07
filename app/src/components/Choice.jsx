import React, { useEffect } from 'react'
import Input from './Input'

function Choice({onChangeCallback, editable, deleteOption}) {
  const [optionName, optionNameInput] = Input({ type: "text" })
  
  useEffect(() => {
    onChangeCallback(optionName)
  })

  return (
    <li>
      <label>
        optionName:
        {optionNameInput}
      </label>
      {editable&&deleteOption&&<button onClick={deleteOption}>
        -
      </button>}
    </li>
  );

}

export default Choice;
