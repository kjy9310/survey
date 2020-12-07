import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom"
import Request from '../components/Request'
import Input from '../components/Input'
import ChoiceList from '../components/ChoiceList'

function CreateQuestion(props) {
//   const history = useHistory()
  const [title, titleInput] = Input({ type: "text" })
//   const [description, descriptionInput] = Input({ type: "text" })

  useEffect(() => {
    // on mount
    // const surveyList = Request.get("survey")
    
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // try{
    //   const response = await Request.post("question", {title, description})
    //   console.log("response", response)
    //   console.log("push to manage")
    //   history.push({pathname:"/manage"});
    // }catch(err){
    //   console.log(err)
    // }
    // props.submitCallback()
  }

  const handleOptionChange = (options) =>{
    console.log('options', options)
  }
  console.log('title', title)
  return (
    <form onSubmit={handleSubmit}>
      <label>
        title:
        {titleInput}
      </label>
      <ChoiceList editable={true} onChangeCallback={handleOptionChange}/>
      <input type="submit" value="Submit" />
    </form>
  );

}

export default CreateQuestion;
