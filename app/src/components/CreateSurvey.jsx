import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom"
import Request from './Request'
import Input from './Input'

function CreateSurvey(props) {
  const history = useHistory()
  const [title, titleInput] = Input({ type: "text" })
  const [description, descriptionInput] = Input({ type: "text" })

  useEffect(() => {
    // on mount
    // const surveyList = Request.get("survey")
    
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const response = await Request.post("survey", {title, description})
      console.log("response", response)
      console.log("push to manage")
      history.push({pathname:"/manage"});
    }catch(err){
      console.log(err)
    }
    props.submitCallback()
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        title:
        {titleInput}
      </label>
      <label>
        description:
        {descriptionInput}
      </label>
      <input type="submit" value="Submit" />
    </form>
  );

}

export default CreateSurvey;
