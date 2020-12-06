import React from 'react';
import { Router, Route, Switch, Redirect } from "react-router-dom"
import Main from './components/Main';
import Login from './components/Login';
import Register from './components/Register';
import ManageSurvey from './components/ManageSurvey';
import { createBrowserHistory } from 'history'
import Auth from './components/Auth'

class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      auth:Auth.getCurrentUser(),
    }
    // this.onSearch = this.onSearch.bind(this);
  }
  render() {
    const history= createBrowserHistory()
    const routes = (
      <Switch>
        <Route path='/' exact component={Main} />
        <Route path='/login' render={()=><Login history={history} loginCallback={(auth)=>{this.setState({auth})}}/>} />
        <Route path='/register' component={Register} />
        {/* <Route path='/survey' exact component={Survey} /> */}
        <PrivateRoute history={history} auth={this.state.auth} path='/manage' component={ManageSurvey} />
      </Switch>
    )
    return <Router history={history}>
      {routes}
    </Router>
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