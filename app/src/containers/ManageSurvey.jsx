import React, { useState, useEffect } from 'react';
import CreateQuestion from './CreateQuestion';
import Request from '../components/Request'
import { useHistory } from "react-router-dom";

function ManageSurvey(props) {
  const [surveyDetail, setSurveyDetail] = useState({})
  const [questionList, setQuestionList] = useState([])
  const [showCreateQuestion, setShowCreateQuestion] = useState(false)
  const history = useHistory()
  useEffect(async () => {
    // on mount
    if (props.match.params.id) {
      const surveyResponse = await Request.get("survey/"+props.match.params.id)
      console.log('surveyResponse', surveyResponse)
      if (surveyResponse.code!==200 || !surveyResponse.result){
        history.goBack()
      } else {
        setSurveyDetail(surveyResponse.result)
      }
      const questionResponse = await Request.get("question?survey_id="+props.match.params.id)
      if (questionResponse.code===200){
        setQuestionList(questionResponse.result)
      }
    }
  }, []);
  
  return (
    <div>
        <div>
            <title>{surveyDetail.title}</title>
            <span>{surveyDetail.description}</span>
        </div>
        <button onClick={()=>setShowCreateQuestion(true)}>Create Question</button>
        {showCreateQuestion&&<CreateQuestion submitCallback={()=>setShowCreateQuestion(false)}/>}
        {questionList &&questionList.length>0&&questionList.map((question)=>{
            return <div>{question.title} {"=>"} {question.choices.toString()}</div>
        })}
    </div>
  );

}

export default ManageSurvey;