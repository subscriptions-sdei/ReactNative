// @flow

export default function newClient(state = {}, action) {
  switch (action.type) {
    case "RECEIVE_CLIENT":
      return Object.assign({}, state, { errors: [] });
    case "CLIENT_NOT_FOUND":
      return Object.assign({}, state, { errors: [] });
    case "CLIENT_CREATED":
      return Object.assign({}, state, { errors: [] });
    case "CLIENT_ALREADY_ASSOCIATED":
      return Object.assign({}, state, { errors: action.errors });
    case "NEW_CLIENT_CLEAR_STATE":
      return {};
    default:
      return state;
  }
}
