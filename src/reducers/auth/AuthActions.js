// @flow

import api from 'libs/api';
import config from 'libs/config';
import { Actions } from 'react-native-router-flux';
import { AsyncStorage } from 'react-native';

export const REQUEST_USER = 'REQUEST_USER';
export const USER_AUTHENTICATED = 'USER_AUTHENTICATED';
export const LOGOUT = 'LOGOUT';

function userAuthenticated(user) {
  return {
    type: 'USER_AUTHENTICATED',
    user
  }
}

function logoutUser() {
  return {
    type: LOGOUT
  }
}

export function clearMessage() {
  return {
    type: 'CLEAR_MESSAGE'
  }
}

async function handleLogout() {
  await api.deleteDatabase();
  await AsyncStorage.clear()
}

export function logout(database) {
  return dispatch => {
    handleLogout(database)
      .then((res) => {
        dispatch(logoutUser());
        Actions.login();
      });
  }
}

async function backendSetup(user) {
  let sessionCookie = `${user.session.cookie_name}=${user.session.session_id}`;
  let remote = `${config.sync_api}/${config.database}`;

  let options = {
    headers: { Cookie: sessionCookie },
    url: remote
  };

  await AsyncStorage.setItem('SYNC_SESSION_ID', user.session.session_id);
  await AsyncStorage.setItem('SYNC_COOKIE_NAME', user.session.cookie_name);

  await api.replicateLocal(options);
  await api.replicateRemote(options);

  return await api.remoteUserProfile(user.email);
}

export function postAuthenticateSetup(user) {
  return dispatch => {

    return backendSetup(user)
      .then((userProfile) => {
        user.profile = userProfile;
        let mergedUser = Object.assign({}, user, userProfile);
        return dispatch(userAuthenticated(mergedUser));
      })
      .catch((error) => {
        console.log('postAuthenticateSetup error', error);
      });
  };
}

export function postAuthenticate(access_token) {
  return dispatch => {
    return api.userInfo(access_token)
      .then((user) => {
        dispatch(postAuthenticateSetup(user));
      }).catch((error) => {
        console.log('postAuthenticate error', error);
      });
  }
}

export function selectUserType(user, userType) {
  return dispatch => {
    let profile = {
      _id: `profile:${user.email}`,
      type: userType
    }

    const updateUser = (user, profile) => {
      let updatedUser = Object.assign({}, user, profile);

      dispatch({ type: 'SELECT_USER_TYPE', user: updatedUser });
      Actions.login();
    }

    if(user.profile.error === 'not_found' || user.profile.reason === 'missing') {
        delete user.profile;
        delete user.error;
        delete user.missing;
        delete user.state;

        api.createDocument(profile)
          .then((res) => {
            return api.getDocument(profile._id)
          })
          .then((profile) => {
            updateUser(user, profile);
          });
    } else {
      api.updateDocument(profile)
        .then((res) => {
          updateUser(user, profile);
        });
    }
  }
}

export function completeSignUp(profile) {
  return dispatch => {
    profile.signUpCompleted = true;

    api.userProfile(profile.email)
      .then((existingProfile) => {
        let updatedProfile = {};

        if(existingProfile.status === 404) {
          return api.createDocument(profile);
        }
        else {
          updatedProfile = Object.assign({}, existingProfile, profile);
          return api.updateDocument(updatedProfile);
        }
      })
      .then((res) => {
        return api.getDocument(res.id);
      })
      .then((profile) => {
        dispatch({ type: 'COMPLETING_SIGN_UP', user: profile });
      })
      .catch(error => {
        console.log("error", error);
      });
  }
}

export function viewedTutorial(user) {
  return dispatch => {
    api.updateDocument(user)
      .then((doc) => {
        return api.getDocument(user._id);
      })
      .then((user) => {
        dispatch({ type: 'VIEWED_TUTORIAL',  user });
      });
  }
}
