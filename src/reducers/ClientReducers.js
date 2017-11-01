// @flow

import { combineReducers } from "redux";

function clients(state = {}, action: any) {
  switch (action.type) {
    case "REQUEST_CLIENTS":
      return Object.assign({}, state, {
        isFetching: true
      });
    case "LIST_CLIENTS":
      let clients = action.clients.rows.map((row: any, i: number) => {

        let email = row.value._id.replace("profile:", "");
         let client: any = row.value;
         client.email = email
        return client;
      });

      return Object.assign({}, state, {
        isFetching: false,
        clients: clients,
      });
    default:
      return state;
  }
}

export default clients;
