// @flow

import { combineReducers } from 'redux';

import auth from './auth/AuthReducers';
import clients from './ClientReducers';
import newClient from './newClient/NewClientReducer';
import currentClient from './CurrentClientReducers';
import diet from './DietReducers';
import foods from './foodSearch/foodSearchReducer';

import clientDiet from './ClientDietReducer';
import clientFoodSearch from './ClientFoodSearchReducers';
import { reducer as formReducer } from 'redux-form';

const appReducer = combineReducers({
  user: auth,
  // Personal Trainer
  clients: clients,
  newClient: newClient,
  currentClient: currentClient,
  diet: diet,
  foods: foods,

  // Client
  clientDiet: clientDiet,
  clientFoodSearch: clientFoodSearch,

  // Both
  form: formReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined
  }

  return appReducer(state, action);
}

export default rootReducer;
