import React, { useState, useEffect, useReducer } from 'react'
import Choice from './Choice'

function ChoiceList({onChangeCallback, options}) {
  
  const addOption = () => {
    onChangeCallback([
      ...options,
      { option_name:"" }
    ])
  }

  const deleteOption = (index) => {
    const removedOptions = options.filter((_, i) => i !== index)
    onChangeCallback(removedOptions)
  }

  const updateOption = ({index, option_name}) => {
    let newOptions = options
    newOptions[index].option_name=option_name
    onChangeCallback(newOptions)
  }

  console.log('options', options)
  return (
    <div>
      <ul>
        {options.map((option, index)=>{
          return <Choice 
            choice={option}
            key={`choiceoption${option.id}${index}`}
            deleteOption={()=>deleteOption(index)} 
            onChangeCallback={(option_name)=>updateOption({index, option_name})}
          />
        })
        }
      </ul> 
      <button className="question-edit-box-choices-button-add" onClick={addOption}> + </button>
    </div>
  );

}

export default ChoiceList;
