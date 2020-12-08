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
    id,
    answer
  } = question
  
  return (
    <div className={`question ${answer?"answered":""}`} onClick={onClickCallback}>
      <span className="question-title">{title}</span>
      <div className="question-choices">
        {choices.map((choice)=>{
          return <label className="question-choices-choice">
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
