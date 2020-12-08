import React, { useState, useEffect } from 'react'

function ViewQuestion({
  question,
  onClickCallback = ()=>{},
  selectable,
  optionSelectedCallback = ()=>{}
}) {
  const {
    title,
    choices,
    id
  } = question
  
  return (
    <div onClick={onClickCallback}>
      <span>{title}</span>
      <div>
        {choices.map((choice)=>{
          return <label>
            <input
              onChange={(e)=>optionSelectedCallback(e.target.value)}
              name={`option${id}`}
              type="radio"
              value={choice.id}
              disabled={!selectable}
            />
            {choice.option_name}
          </label>
        })}
      </div>
    </div>
  );

}

export default ViewQuestion;
