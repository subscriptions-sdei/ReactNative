// @flow

import { Actions } from 'react-native-router-flux';
import api from 'libs/api';

export function currentClient(currentClient) {
  return dispatch => {
    dispatch({ type: 'CURRENT_CLIENT', currentClient });
  }
}

export function updateUserProfile(profile) {
  return dispatch => {
    api.updateDocument(profile)
      .then((res) => {
        api.getDocument(res.id)
          .then((client) => {
            dispatch({ type: 'UPDATE_CLIENT_PROFILE', currentClient: client });

            Actions.pop({title: `${client.firstName} ${client.surname}`});
          });
      });
  }
}
