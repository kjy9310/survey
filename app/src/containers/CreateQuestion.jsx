import React, { useState, useEffect } from 'react'
import Request from '../components/Request'
import Input from '../components/Input'
import ChoiceList from '../components/ChoiceList'

function CreateQuestion({surveyId, question, editMode, submitCallback}) {
  const {
    title:defaultTitle,
    choices:defaultChoices,
    id:question_id
  } = question

  const [title, titleInput, setTitle] = Input({ type: "text" })
  const [choices, setChoices] = useState([])

  useEffect(()=>{
    setChoices(defaultChoices)
    setTitle(defaultTitle)
  },[defaultTitle, defaultChoices])
  
  const handleSubmit = async () => {
    if (editMode) {
      try{
        const questionObject = {
          ...question,
          title,
          choices
        }
        const response = await Request.put("question/"+surveyId, questionObject)
        console.log("response", response)
        submitCallback()
      }catch(err){
        console.log(err)
      }
    } else {
      try{
        const questionObject = {
          title,
          survey_id: parseInt(surveyId),
          type_id: 1,
          choices:choices.map((choice)=>{
            if (!choice.option_name){
              return
            }
            return {
              ...choice,
            }
          })
        }
        const response = await Request.post("question", questionObject)
        console.log("response", response)
        submitCallback()
      }catch(err){
        console.log(err)
      }
    }
  }

  const deleteQuestion = async () => {
    const deleteResponse = await Request.delete("question/"+question_id)
    console.log(deleteResponse)
    if (deleteResponse.code===200){
      submitCallback()
    }
  }

  const handleOptionChange = (options) =>{
    setChoices(options)
  }
  
  return (
    <form onSubmit={(event)=>event.preventDefault()}>
      <label>
        title:
        {titleInput}
      </label>
      <ChoiceList options={choices} onChangeCallback={handleOptionChange}/>
      <input onClick={handleSubmit} type="submit" value="Submit" />
      {editMode&&<button onClick={deleteQuestion}>x</button>}
    </form>
  );

}

export default CreateQuestion;
