// @flow

import { Serving } from "./Serving";

export default class Food {
  _id: string;
  name: string;
  grams: number;
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
  type: "food";
  servings: Array<Serving>;
  categories: Array<string>;
  mealType: Array<string>;
  image: string;
}
