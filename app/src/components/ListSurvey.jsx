import React from 'react';
import { useHistory } from "react-router-dom";

function ListSurvey({list}) {
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
                <span>{survey.description}</span>
              </div>
            </li>
        })}
    </ul>
  );

}

export default ListSurvey;
