import React from 'react'
import Input from './Input'
import { useHistory } from "react-router-dom"

function Main() {
  const history = useHistory()
  const [surveyId, surveyIdInput] = Input({ type: "text" })

  return (
    <div className="App">
      <header className="App-header">
        <title>Survey Site</title>
      </header>
      <div className="main-survey-info-box">
        <label className="main-survey-info-box-label">
          <span className="main-survey-info-box-label-message">Please enter survey number to take survey.</span>
          {surveyIdInput}
        </label>
        <button
          className="main-survey-info-box-button"
          onClick={()=>history.push("/survey/"+surveyId)}
        >{`>>>`}</button>
      </div>
      <div className="main-to-manage-sign-box">
        <span className="main-to-manage-sign-box-message"> To manage survey please sign-in or sign-up to create new one. </span>
        <button
          className="main-to-manage-sign-box-button"
          onClick={()=>history.push("/login")}
        >SignIn</button>
        <button
          className="main-to-manage-sign-box-button"
          onClick={()=>history.push("/register")}
        >SignUp</button>
      </div>
    </div>
  );
}

export default Main;