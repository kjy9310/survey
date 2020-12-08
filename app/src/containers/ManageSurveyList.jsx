import React, { useState, useEffect } from 'react';
import CreateSurvey from '../components/CreateSurvey';
import ListSurvey from '../components/ListSurvey';
import Request from '../components/Request'


function ManageSurveyList(props) {
  const [surveyList, setSurveyList] = useState([])
  const [showCreateSurvey, setShowCreateSurvey] = useState(false)
  
  useEffect(() => {
    // on mount
    getSurveyList()
  }, []);

  const getSurveyList = async() =>{
    const surveyListResponse = await Request.get("survey")
    console.log(surveyListResponse)
    if (surveyListResponse.code===200){
        setSurveyList(surveyListResponse.result)
    }
  }

  const deleteSurvey = async (survey_id) => {
    const surveyDeleteResponse = await Request.delete("survey/"+survey_id)
    console.log(surveyDeleteResponse)
    if (surveyDeleteResponse.code===200){
      getSurveyList()
    }
  }

  console.log('surveyList', surveyList)
  return (
    <div className="survey-list">
      <span className="survey-list-title"> Survey List </span>
        <button className="survey-list-button-add" onClick={()=>setShowCreateSurvey(true)}>New</button>
        {showCreateSurvey&&<CreateSurvey
          submitCallback={()=>{
            setShowCreateSurvey(false)
            getSurveyList()
          }}
        />}
        <ListSurvey list={surveyList} deleteSurvey={deleteSurvey}/>
    </div>
  );

}

export default ManageSurveyList;