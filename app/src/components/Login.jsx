import React from 'react'
import Auth from './Auth'
import Input from './Input'

function Login() {
  const [username, usernameInput] = Input({ type: "text" });
  const [password, passwordInput] = Input({ type: "password" });
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password){
      alert("please check the login id or password.")
    }
    try{
      const response = await Auth.login({
        username, password
      })
      console.log('response', response, response.code===200)
      if(response.code===200){
        window.location.replace("/manage")
      }else{
        alert("please check the login id or password.")
      }
    }catch(err){
      console.log(err)
    }
  }
  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <label>
          Username
          {usernameInput}
        </label>
        <label>
          Password
          {passwordInput}
        </label>
        <input className="login-form-button" type="submit" value="Login" />
      </form>
    </div>
  );

}

export default Login;
