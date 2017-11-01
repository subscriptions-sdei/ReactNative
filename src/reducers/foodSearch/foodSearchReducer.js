// @flow

import Food from "entities/Food";
// Fuse not working with ES6 so I require the package as per ES5 standard
const Fuse = require("fuse.js");

const options = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    "name"
  ]
};

function filterFoods(foods: Array<Food>, category: string, mealType: string) {
  return foods.filter((food) => {
    let containsCategory: boolean = false;
    let containsMealType: boolean = false;

    if (category === "all" && mealType === "all") {
      return true;
    }

    if (food.categories) {
      containsCategory = (food.categories).includes(category);
    }

    if (food.mealType) {
      containsMealType = (food.mealType).includes(mealType);
    }

    if (category === "all") {
      return containsMealType;
    }

    if (mealType === "all") {
      return containsCategory;
    }

    return containsCategory && containsMealType;
  });
}

function shortListedFoods(foodIds: Array<number>, foods: Array<Food>) {
  let shortListedFoods: Array<any> = [];
  let excludedFoods: Array<any> = [];

  if (foodIds) {
    shortListedFoods = foods.filter((food: Food) => (foodIds).includes(food._id));
    excludedFoods = foods.filter((food: Food) => !(foodIds).includes(food._id));
  } else {
    excludedFoods = foods;
  }

  return { excludedFoods: excludedFoods, shortListedFoods: shortListedFoods };
}

function sortFoods(foods: Array<Food>) {
  return foods.sort((n1: Food, n2: Food) => {
    if (n1.name > n2.name)
      return 1;

    if (n1.name < n2.name)
      return -1;

    return 0;
  });
}

function searchFoodsByText(foods: Array<Food>, searchText: string) {
  if (searchText !== undefined && searchText.length > 0) {
    let fuse = new Fuse(foods, options);
    return fuse.search(searchText);
  }
  return foods;
}

export default function foodSearch(state: any = {}, action: any) {
  switch (action.type) {
    case "REQUEST_FOODS":
      return Object.assign({}, state, { isFetching: true });
    case "RECEIVE_FOODS":
      let foods = action.foods.rows.map((food: any) => food.value);
      let sortedFoods = sortFoods(foods);

      return Object.assign({}, state, {
        isFetching: false,
        foods: searchFoodsByText(sortedFoods, action.searchtext),
        food: action.foods,
        searchtext: state.searchtext
      });
    case "FILTER_FOODS":
      foods = action.foods.rows.map((food: any) => food.value);
      sortedFoods = filterFoods(sortFoods(foods), action.category, action.mealType) ;

      return Object.assign({}, state, {
        isFetching: false,
        foods: searchFoodsByText(sortedFoods, state.searchtext),
        food: action.foods,
        searchtext: state.searchtext
      });
    case "SEARCH_FOODS":
      foods = state.food.rows.map((food: any) => food.value);
      sortedFoods = sortFoods(foods);
      return Object.assign({}, state, {
        isFetching: false,
        foods: searchFoodsByText(sortedFoods, action.searchtext),
        food: state.food,
        searchtext: action.searchtext
      });
    case "RECIEVE_FOODS_SHORT_LIST":
      foods = shortListedFoods(action.foodIds, state.foods);

      return Object.assign({}, state, foods);
    case "FILTER_SHORT_LIST":
      foods = shortListedFoods(action.foodIds, state.foods);
      let filteredShortList = filterFoods(foods.shortListedFoods || [], action.category, action.mealType);

      return Object.assign({}, state, { excludedFoods: foods.excludedFoods, shortListedFoods: filteredShortList });
    case "REMOVE_SHORT_LIST_FOOD":
    default:
      return state;
  }
}
