// @flow

import React from 'react';
import Loading from './Loading';
import config from 'libs/config';

import Auth0Lock from 'react-native-lock';

import { AsyncStorage } from 'react-native';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.lock = new Auth0Lock({clientId: config.auth0_client_id, domain: config.auth0_domain});
  }

  componentWillReceiveProps() {
    this.login();
  }

  componentDidMount() {
    this.login();
  }

  async sessionCheck() {
    let sessionId = await AsyncStorage.getItem('SYNC_SESSION_ID');
    let cookieName = await AsyncStorage.getItem('SYNC_COOKIE_NAME');

    return { cookieName: cookieName, sessionId: sessionId };
  }

  login() {
    this.sessionCheck()
      .then((session) => {
        const user = this.props.user;
        const emptyUser = Object.keys(user).length === 0;

        if(!emptyUser && session.cookieName !== null && session.sessionId !== null) {
          this.props.userTypeNavigation();
        } else {
          this.lock.show({
            closable: false,
            rememberLastLogin: true,
            loginAfterSignup: true,
          }, (err, profile, token) => {
            this.props.postAuthenticate(token.accessToken);
          });
        }
      })
      .catch((error) => {
        console.log('error', error)
      });
  }

  render() {
    return <Loading />;
  }
};
