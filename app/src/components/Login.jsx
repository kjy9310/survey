import React from 'react'
import Auth from './Auth'
import Input from './Input'

function Login() {
  const [username, usernameInput] = Input({ type: "text" });
  const [password, passwordInput] = Input({ type: "password" });
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const response = await Auth.login({
        username, password
      })
      console.log('response', response, response.code===200)
      if(response.code===200){
        window.location.replace("/manage")
      }
    }catch(err){
      console.log(err)
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        {usernameInput}
      </label>
      <label>
        Password:
        {passwordInput}
      </label>
      <input type="submit" value="Submit" />
    </form>
  );

}

export default Login;
