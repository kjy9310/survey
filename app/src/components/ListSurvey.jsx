import React from 'react';
import { useHistory } from "react-router-dom";

function ListSurvey({list, deleteSurvey}) {
  const history = useHistory()
  const onClickSurvey = (surveyId)=>{
    history.push("/manage/survey/"+surveyId)
  }
  return (
    list&&<ul className="survey-list-ul">
        {list.length>0&&list.map((survey)=>{
            return <li className="survey-list-ul-li">
              <div className="survey-list-ul-li-content" onClick={()=>onClickSurvey(survey.id)}>
                <span className="survey-list-ul-li-content-title">{survey.title}</span>
                <p className="survey-list-ul-li-content-description">{survey.description}</p>
              </div>
              <button className=".survey-list-ul-li-button-delete" onClick={()=>deleteSurvey(survey.id)}>
                x
              </button>
            </li>
        })}
    </ul>
  );

}

export default ListSurvey;
