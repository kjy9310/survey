import React, { useEffect } from 'react'
import Input from './Input'

function Choice({onChangeCallback, deleteOption, choice}) {
  const [optionName, optionNameInput, setOptionName] = Input({ type: "text", defaultValue: choice.option_name })
  
  useEffect(() => {
    onChangeCallback(optionName)
  })

  return (
    <li>
      <label>
        optionName:
        {optionNameInput}
      </label>
      {deleteOption&&<button onClick={deleteOption}>
        -
      </button>}
    </li>
  );

}

export default Choice;
