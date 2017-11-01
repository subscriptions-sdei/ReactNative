// @flow

import Food from "./Food";

export default class MealFood {
  foodId: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  grams: number;
  selected: boolean;
  serving: string;
  type: "mealFood";
  viewAsGrams: boolean;

  foodToMealFood(food: Food) {
    this.foodId = food._id;
    this.name = food.name;
    this.serving = "g";
    this.calories = food.calories;
    this.protein = food.protein;
    this.fat = food.fat;
    this.carbs = food.carbs;
  }

  updateMacros(macros: any) {
    this.protein = macros.protein;
    this.carbs = macros.carbs;
    this.fat = macros.fat;
    this.grams = macros.grams;
  }
}
