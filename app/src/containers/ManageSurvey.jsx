import React, { useState, useEffect } from 'react';
import CreateQuestion from './CreateQuestion';
import Request from '../components/Request'
import { useHistory } from "react-router-dom";
import CreateSurvey from '../components/CreateSurvey';
import ViewQuestion from '../components/ViewQuestion';

function ManageSurvey(props) {
  const [surveyDetail, setSurveyDetail] = useState({})
  const [questionList, setQuestionList] = useState([])
  const [showCreateQuestion, setShowCreateQuestion] = useState(false)
  const history = useHistory()
  useEffect(async () => {
    // on mount
    if (props.match.params.id) {
      getSurveyDetail()
      getQuestionList()
    }
  }, []);

  const getSurveyDetail = async() => {
    const surveyResponse = await Request.get("survey/"+props.match.params.id)
    console.log('surveyResponse', surveyResponse)
    if (surveyResponse.code!==200 || !surveyResponse.result){
      history.goBack()
    } else {
      setSurveyDetail(surveyResponse.result)
    }
  }

  const getQuestionList = async()=>{
    const questionResponse = await Request.get("question?survey_id="+props.match.params.id)
    if (questionResponse.code===200){
      setQuestionList(questionResponse.result)
    }
  }

  const setQuestionEditMode = (index) => {
    setQuestionList(questionList.map((question, i)=>{
      return {
        ...question,
        editMode:(i===index)
      }
    }))
  }
  
  return (
    <div className="survey-detail">
      <span className="survey-detail-title">Survey Detail</span>
      <CreateSurvey
        editMode={true}
        survey={surveyDetail}
        submitCallback={()=>{
          setShowCreateQuestion(false)
          getSurveyDetail()
        }}
      />
      <span className="survey-detail-title">Question list</span>
      <button className="survey-detail-button-add" onClick={()=>setShowCreateQuestion(true)}>Create Question</button>
      {showCreateQuestion&&<CreateQuestion
        question={{ title:"", choices:[] }}
        surveyId={props.match.params.id}
        submitCallback={()=>{
          setShowCreateQuestion(false)
          getQuestionList()
        }}
      />}
      {questionList &&questionList.length>0&&questionList.map((question, index)=>{
        return <div>
          {
          question.editMode
          ? <CreateQuestion
            question={question}
            editMode={question.editMode}
            surveyId={props.match.params.id}
            submitCallback={()=>{
              getQuestionList()
            }}
          />
          : <ViewQuestion
              onClickCallback={()=>setQuestionEditMode(index)}
              question={question}
            />
          }
        </div>
      })}
    </div>
  );

}

export default ManageSurvey;