// @flow

import { combineReducers } from "redux";

function mapDiets(unparsedDiets: any) {
  return unparsedDiets.rows.map((diet: any) => diet.value );
}

function clientDiet(state = {}, action: any) {
  switch (action.type) {
    case "CLIENT_REQUEST_DIETS":
      return state;
    case "CLIENT_LIST_DIETS":
      return Object.assign({}, state, {
        diets: action.diets
      });
    case "CLIENT_CURRENT_DIET":
      return Object.assign({}, state, {
        current: action.currentDiet
      });
    case "CREATE_CLIENT_DIET":
      return Object.assign({}, state, {
        current: null
      });
    default:
      return state;
  }
}

export default clientDiet;
