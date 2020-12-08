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
  
  const submitSurvey = async() =>{
    const notAnsweredQuestion = surveyData.questions.find((question)=>!question.answer)
    if (notAnsweredQuestion){
      alert("please select answer for all questions")
      return
    }
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
    <div>
      <div>
        <label>
          name : {nameInput}
        </label>
        <label>
          email : {emailInput}
        </label>
      </div>
      {surveyData.survey&&<div>
        <title>{surveyData.survey.title}</title>
        <p>{surveyData.survey.description}</p>
      </div>}
      {surveyData.questions&&surveyData.questions.length>0&&surveyData.questions.map((question, index)=>{
        return <div key={`surveyquestion${index}`}>
          <ViewQuestion
            selectable={true}
            question={question}
            optionSelectedCallback={(choice_id)=>setAnswer(index, choice_id)}
          />
        </div>
      })}
      <button onClick={submitSurvey}>Submit</button>
    </div>
  );

}

export default ManageSurvey;