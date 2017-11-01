// @flow

import api from 'libs/api';
import { Actions } from 'react-native-router-flux';

function receiveDiets(diets) {
  return { type: 'LIST_DIETS', diets }
}

export function currentDiet(currentDiet) {
  return dispatch => {
    dispatch({ type: 'SET_CURRENT_DIET', currentDiet });
  }
}

export function newDiet(diet) {
  return dispatch => {
    api.createDocument(diet)
      .then((res) => {
        return api.getDocument(res.id)
      })
      .then((diet) => {
        dispatch(currentDiet(diet));
        Actions.pop();
        Actions.mealPlan();
      });
  }
}

export function currentMacros(calories) {
  let defaultMacros = { calories: 0, protein: 0, carbs: 0, fat: 0 };

  return dispatch => {
    if(calories === undefined) {
      let macros = { calories: 0, protein: 0, carbs: 0, fat: 0 };
      dispatch({ type: 'SET_CURRENT_MACROS', macros: defaultMacros });
    } else {
      let keys = Object.keys(calories);
      let meals = calories[keys[0]].meals;

      if(meals !== undefined) {
        meals = Object.keys(meals).map(meal => meals[meal]);
        meals = [].concat(...meals);

        let macros = meals.reduce((prev, curr) => {
          return {
            calories: (parseFloat(prev.calories) + parseFloat(curr.calories)).toFixed(1),
            protein: (parseFloat(prev.protein) + parseFloat(curr.protein)).toFixed(1),
            carbs: (parseFloat(prev.carbs) + parseFloat(curr.carbs)).toFixed(1),
            fat: (parseFloat(prev.fat) + parseFloat(curr.fat)).toFixed(1)
          }
        }, defaultMacros);

        dispatch({ type: 'SET_CURRENT_MACROS', macros: macros });
      }
    }
  }
}

export function fetchDiets(user) {
  return dispatch => {
    dispatch({ type: 'REQUEST_DIETS' });

    return api.fetchView('diets', { key: `${user.email}` })
      .then((diets) => {
        dispatch(receiveDiets(diets));
      })
      .catch((error) => {
        console.log('fetch diets error', error);
      });
  }
}

export function deleteDiet(diet, currentClient) {
  return dispatch => {
    dispatch({ type: 'DELETE_DIET' });

    api.deleteDocument(diet)
      .then((res) => {
        dispatch(fetchDiets(currentClient));
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
}

export function updateDiet(diet, currentClient) {
  return dispatch => {
    dispatch({ type: 'UPDATE_DIET' });

    api.updateDocument(diet)
      .then((res) => {
        return api.getDocument(diet._id);
      })
      .then((res) => {
        dispatch(currentDiet(res));
        dispatch(fetchDiets(currentClient));
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
}
