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

  console.log('surveyList', surveyList)
  return (
    <div>
        <button onClick={()=>setShowCreateSurvey(true)}>Create Survey</button>
        {showCreateSurvey&&<CreateSurvey submitCallback={()=>setShowCreateSurvey(false)}/>}
        <ListSurvey list={surveyList}/>
    </div>
  );

}

export default ManageSurveyList;