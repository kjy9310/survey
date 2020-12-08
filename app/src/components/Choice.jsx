import React, { useEffect } from 'react'
import Input from './Input'

function Choice({onChangeCallback, deleteOption, choice}) {
  const [optionName, optionNameInput] = Input({ type: "text", defaultValue: choice.option_name })
  
  useEffect(() => {
    onChangeCallback(optionName)
  })

  return (
    <li className="question-edit-box-choices-choice-li">
      <label className="question-edit-box-label">
        optionName:
        {optionNameInput}
      </label>
      {deleteOption&&<button className="question-edit-box-button-del" onClick={deleteOption}>
        -
      </button>}
    </li>
  );

}

export default Choice;
