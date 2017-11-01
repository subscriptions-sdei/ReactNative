// @flow

import { USER_AUTHENTICATED,
         LOGOUT } from "./AuthActions";

function user(state = {}, action: any) {
  switch (action.type) {
    case USER_AUTHENTICATED:
    case "FAILED_LOGIN":
    case "SELECT_USER_TYPE":
    case "COMPLETING_SIGN_UP":
    case "SIGN_UP_COMPLETED":
    case "VIEWED_TUTORIAL":
      return Object.assign({}, state, action.user);
    case LOGOUT:
      return {};
    default:
      return state;
  }
}

export default user;
