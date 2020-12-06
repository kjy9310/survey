import React from 'react';
import Auth from './Auth'

class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      username: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  async handleSubmit(event) {
    console.log('submitted: ', this.state);
    event.preventDefault();
    const response = await Auth.login(this.state, this.props.loginCallback)
    console.log("response", response)
    console.log("push to manage")
    this.props.history.push({pathname:"/manage"});
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.handleChange}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default Login;
