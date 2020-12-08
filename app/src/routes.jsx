import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom"
import Main from './components/Main'
import Login from './components/Login'
import Register from './components/Register'
import ManageSurveyList from './containers/ManageSurveyList';
import ManageSurvey from './containers/ManageSurvey'
import Auth from './components/Auth'
import Survey from './containers/Survey'

class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      auth:Auth.getCurrentUser(),
    }
  }

  render() {
    return <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Main} />
        <Route path='/login' render={()=><Login />} />
        <Route path='/register' render={()=><Register />} />
        <Route path='/survey/:id' component={Survey} />
        <PrivateRoute auth={this.state.auth} path='/manage/survey/:id' component={ManageSurvey} />
        <PrivateRoute auth={this.state.auth} path='/manage' component={ManageSurveyList} />
      </Switch>
    </BrowserRouter>
  }
}

export default Routes;

function PrivateRoute ({component: Component, auth, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => auth
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}