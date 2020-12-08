import React, { useEffect, useState } from 'react'
import Request from './Request'
import Input from './Input'

function CreateSurvey(props) {
  const {
    title:defaultTitle,
    description:defaultDescription
  } = props.survey||{}
  
  const [title, titleInput, setTitle] = Input({ type: "text" })
  const [description, setDescription] = useState("")
  
  useEffect(()=>{
    setDescription(defaultDescription)
    setTitle(defaultTitle)
  },[defaultTitle, defaultDescription])
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (props.editMode) {
      try{
        const survey = props.survey
        const params = {
          ...survey,
          title,
          description
        }
        const response = await Request.put("survey/"+survey.id, params)
        console.log("response", response)
        props.submitCallback()
      }catch(err){
        console.log(err)
      }
    } else {
      try{
        const response = await Request.post("survey", {title, description})
        console.log("response", response)
        props.submitCallback()
      }catch(err){
        console.log(err)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        title:
        {titleInput}
      </label>
      <label>
        description:
        <textArea onChange={(e)=>setDescription(e.target.value)} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );

}

export default CreateSurvey;
