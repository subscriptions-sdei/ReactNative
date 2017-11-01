// @flow

import React from 'react';
import { Actions } from 'react-native-router-flux';
import { postAuthenticate, postAuthenticateSetup } from 'reducers/auth/AuthActions';
import { connect } from 'react-redux';
import Login from "../components/Login";
import LoginDeveloper from "../components/LoginDeveloper";

class LoginContainer extends React.Component {
  constructor(props) {
    super(props);
    this.userTypeNavigation = this.userTypeNavigation.bind(this);
    this.postAuthenticateUser = this.postAuthenticateUser.bind(this);
    this.postAuthenticateDeveloper = this.postAuthenticateDeveloper.bind(this);
  }

  async userTypeNavigation() {
    const user = this.props.user;

    if(user && user.type === 'personalTrainer') {
      Actions.personalTrainerDashboard();
    } else {
      if(user.type === undefined) {
        Actions.selectUserType({ user: user, dispatch: this.props.dispatch });
      } else if(user.signUpCompleted) {
          Actions.clientDashboard();
      } else {
        Actions.signupProfile();
      }
    }
  }

  postAuthenticateUser(accessToken) {
    return this.props.dispatch(postAuthenticate(accessToken));
  }

  postAuthenticateDeveloper(session) {
    return this.props.dispatch(postAuthenticateSetup(session));
  }

  render() {
    if (__DEV__) {
      return (
        <LoginDeveloper
          user={this.props.user}
          postAuthenticate={this.postAuthenticateDeveloper}
          userTypeNavigation={this.userTypeNavigation}
         />
      )
    }

    return (
      <Login
        postAuthenticate={this.postAuthenticateUser}
        userTypeNavigation={this.userTypeNavigation}
        user={this.props.user} />
    )
  }
};

function mapUser(state) {
  return { user: state.user };
}

export default connect(mapUser)(LoginContainer)
