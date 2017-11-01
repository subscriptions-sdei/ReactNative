// @flow

import { Actions } from 'react-native-router-flux';
import { fetchClients } from 'actions/ClientActions';
import api from 'libs/api';

type Profile = {
  members: Array<any>;
  reason: string;
  status: number;
  email: string;
}

function createClient(clientEmail: string, ptEmail: string) {
  const client = { email: clientEmail };

  return api.createClient(client, ptEmail)
    .then((res) => {
      return api.userProfile(client.email);
    });
}

export function clear(){
  return dispatch => {
    dispatch({ type: 'NEW_CLIENT_CLEAR_STATE' });
  }
}

export function associatePersonalTrainer(clientEmail: string, ptEmail: string) {
  return dispatch => {
    api.remoteUserProfile(clientEmail)
      .then((profile: Profile) => {
        if(!profile._id) {
          createClient(clientEmail, ptEmail)
            .then((profile: Profile) => {
              dispatch({ type: 'CLIENT_CREATED' });
              dispatch(fetchClients());
              Actions.pop();
            });
        } else {
          let exists = profile.members ? profile.members.includes(ptEmail) : false;

          if(!exists) {
            profile.members = [clientEmail, ptEmail];
            delete profile.status;
            delete profile.reason;
            delete profile.missing;
            delete profile.error;

            api.remoteUserProfileUpdate(profile)
              .then((updated) => {
                dispatch(fetchClients());
                Actions.pop();
              })
          } else {
            let errors = ['Already a client'];
            dispatch({ type: 'CLIENT_ALREADY_ASSOCIATED', errors: errors });
          }
        }
      });
  }
}
