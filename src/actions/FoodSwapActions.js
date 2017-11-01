// @flow

import { updateDiet } from 'actions/ClientDietActions';
import { Actions } from 'react-native-router-flux';
import MealFood from 'entities/MealFood';

export function convertFood(diet, user, mealNo, substitute, selectedFood, macros, viewAsGrams) {
  return dispatch => {
    dispatch({ type: 'FOOD_SWAP' });

    let calories = Object.keys(diet.calories)[0];
    let mealIndex = diet.calories[calories].meals[mealNo].findIndex((f) => f.foodId === selectedFood.foodId);

    let mealFood = new MealFood();
    mealFood.foodToMealFood(substitute);
    mealFood.updateMacros(macros);
    mealFood.quantity = macros.grams;
    mealFood.calories = selectedFood.calories;
    mealFood.viewAsGrams = viewAsGrams;

    diet.calories[calories].meals[mealNo][mealIndex] = mealFood;

    dispatch(updateDiet(diet, user));
    Actions.pop();
  }
}
