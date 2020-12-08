import React from 'react';
import { useHistory } from "react-router-dom";

function ListSurvey({list, deleteSurvey}) {
  const history = useHistory()
  const onClickSurvey = (surveyId)=>{
    history.push("/manage/survey/"+surveyId)
  }
  return (
    list&&<ul>
        {list.length>0&&list.map((survey)=>{
            return <li>
              <div onClick={()=>onClickSurvey(survey.id)}>
                <span>{survey.title}</span>
                <p>{survey.description}</p>
              </div>
              <button onClick={()=>deleteSurvey(survey.id)}>
                x
              </button>
            </li>
        })}
    </ul>
  );

}

export default ListSurvey;
