import React, { useState, useEffect } from 'react'
import Request from '../components/Request'
import { useHistory } from "react-router-dom"
import ViewQuestion from '../components/ViewQuestion'
import Input from '../components/Input'

function ManageSurvey(props) {
  const history = useHistory()
  const [surveyData, setSurveyData] = useState({})
  const [name, nameInput] = Input({ type: "text" })
  const [email, emailInput] = Input({ type: "email" })
  const [checkMode, setCheckMode] = useState(false)

  useEffect(()=>{
    getSurveyData()
  },[])

  const getSurveyData = async() => {
    const surveyResponse = await Request.get("take_survey/"+props.match.params.id)
    console.log('surveyResponse', surveyResponse)
    if (surveyResponse.code!==200 || !surveyResponse.result){
      history.push("/")
    } else {
      setSurveyData(surveyResponse.result)
    }
  }

  const setAnswer = (index, choiceId) =>{
    setSurveyData({
      ...surveyData,
      questions: surveyData.questions.map((question, i)=>{
        return {
          ...question,
          ...(index===i ? {answer: choiceId}:{})
        }
      })
    })
  }

  const validate = () => {
    const notAnsweredQuestion = surveyData.questions.find((question)=>!question.answer)
    if (notAnsweredQuestion){
      alert("please answer all questions.")
      return
    } else if (!name || !email) {
      alert("please enter name and email address.")
      return
    }
    setCheckMode(true)
  }

  const submitSurvey = async() =>{ 
    const params = {
      name,
      email,
      survey_id: surveyData.survey.id,
      answers: surveyData.questions.map(question=>{
        return {
          question_id: parseInt(question.id),
          choice_id: parseInt(question.answer)
        }
      })
    }
    const surveyResponse = await Request.post("take_survey", params)
    console.log('surveyResponse', surveyResponse)
    if (surveyResponse.code!==200 || !surveyResponse.result){
      alert("sending survey result failed")
    } else {
      alert("thank you for taking survey")
      history.push("/")
    }
  }

  return (
    <div className="survey-list">
      {checkMode&&<span className="survey-list-message">Please check the answers before submit</span>}
      <div className="survey-list-top-group">
        <label className="survey-list-top-group-label">
          name {checkMode?`: ${name}`:nameInput}
        </label>
        <label className="survey-list-top-group-label">
          email {checkMode?`: ${email}`:emailInput}
        </label>
      </div>
      {surveyData.survey&&<div>
        <span className="survey-list-title">{surveyData.survey.title}</span>
        <p className="survey-list-description">{surveyData.survey.description}</p>
      </div>}
      {surveyData.questions&&surveyData.questions.length>0&&surveyData.questions.map((question, index)=>{
        return <div key={`surveyquestion${index}`}>
          <ViewQuestion
            selectable={!checkMode}
            question={question}
            optionSelectedCallback={(choice_id)=>setAnswer(index, choice_id)}
          />
        </div>
      })}
      {checkMode
      ?<div>
        <button className="survey-list-button-submit" onClick={submitSurvey}>Submit</button>
        <button className="survey-list-button-cancel" onClick={()=>setCheckMode(false)}>Cancel</button>
      </div>
      :<button className="survey-list-button-submit" onClick={validate}>Submit</button>}
    </div>
  );

}

export default ManageSurvey;