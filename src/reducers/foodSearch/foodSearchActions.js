// @flow

import api from 'libs/api';

function receiveFoods(foods) {
  return { type: 'RECEIVE_FOODS', foods }
}

export function fetchFoods() {
  return dispatch => {
    dispatch({ type: 'REQUEST_FOODS' });

    api.fetchView('foods')
      .then((foods) => {
        dispatch({ type: 'RECEIVE_FOODS', foods: foods });
      })
      .catch((error) => {
        console.log('fetch foods error', error);
      });
  }
}

export function filterFoods(category, mealType) {
  return dispatch => {
    api.fetchView('foods')
      .then((foods) => {
        dispatch({ type: 'FILTER_FOODS', foods, category, mealType });
      });
  }
}

//No need to fetch the data from server again, Just passing the filter data by Entered Text
// for particular category, mealtype
export function searchFoods(searchtext,category,mealType) {
  return dispatch => {
    dispatch({ type: 'SEARCH_FOODS', searchtext,category,mealType });
  };
}

export function filterShortListFoods(email, category, mealType) {
  return dispatch => {
    api.fetchView('foods')
      .then((foods) => {
        dispatch(receiveFoods(foods));
        return api.fetchFoodShortList(email);
      })
      .then((res) => {
        dispatch({ type: 'FILTER_SHORT_LIST', foodIds: res.foodIds, category, mealType });
      });
  }
}

export function fetchShortListedFoods(email) {
  return dispatch => {
    dispatch({ type: 'REQUEST_SHORT_LIST_FOODS' });

    api.fetchView('foods')
      .then((foods) => {
        dispatch(receiveFoods(foods));
        return api.fetchFoodShortList(email);
      })
      .then((res) => {
        dispatch({ type: 'RECIEVE_FOODS_SHORT_LIST', foodIds: res.foodIds });
      })
      .catch((error) => {
        console.log('fetch foods error', error);
      });
  }
}

export function shortListFood(foodId, user) {
  return dispatch => {
    dispatch({ type: 'SHORT_LIST_FOOD' });

    api.shortListFood(foodId, user)
      .then((res) => {
        dispatch(fetchShortListedFoods(user.email));
      });
  }
}

export function removeFoodFromShortList(foodId, user) {
  return dispatch => {
    dispatch({ type: 'REMOVE_SHORT_LIST_FOOD' });

    api.removeShortListFood(foodId, user)
      .then((res) => {
        dispatch(fetchShortListedFoods(user.email));
      });
  }
}
