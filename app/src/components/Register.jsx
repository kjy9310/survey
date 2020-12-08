import React from 'react'
import Auth from './Auth'
import Input from './Input'

function Register() {
  const [username, usernameInput] = Input({ type: "text" })
  const [password, passwordInput] = Input({ type: "password" })
  const [passwordCheck, passwordCheckInput] = Input({ type: "password" })
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (passwordCheck !== password){
      alert("password and password check is not the same.")
      return
    } else if (!username){
      alert("please enter user name.")
      return
    }
    try{
      const response = await Auth.register({
        username, password
      })
      console.log('response', response, response.code===200)
      if(response.code===200){
        const loginRes = await Auth.login({
          username, password
        })
        console.log('loginRes', loginRes, loginRes.code===200)
        if(loginRes.code===200){
          window.location.replace("/manage")
        }
      } else if (response.code>=400 && response.code < 500){
        alert("Please check the format of the username or password.")
      }
    }catch(err){
      console.log(err)
      alert("error occured during the registration")
    }
  }
  return (
    <div className="register-form">
      <form onSubmit={handleSubmit}>
        <label>
          <span>Username</span>
          {usernameInput}
        </label>
        <label>
          <span>Password</span>
          {passwordInput}
        </label>
        <label>
          <span>Password check</span>
          {passwordCheckInput}
        </label>
        <input className="register-form-button" type="submit" value="Regist" />
      </form>
    </div>
  );

}

export default Register;