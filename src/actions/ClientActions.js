// @flow

import api from 'libs/api';

function receiveClients(clients) {
  return {
    type: 'LIST_CLIENTS',
    clients
  }
}

export function fetchClients() {
  return dispatch => {
    dispatch({type: 'REQUEST_CLIENTS'});

    return api.fetchView('clients')
      .then((clients) => {
        dispatch(receiveClients(clients));
      })
      .catch((error) => {
        console.log('fetch clients error', error);
      });
  }
}
