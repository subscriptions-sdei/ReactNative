// @flow

function diet(state = {}, action: any) {
  switch (action.type) {
    case "LIST_DIETS":
      let diets = action.diets.rows.map((diet: any) => diet.value);

      return Object.assign({}, state, {
        diets: diets,
      });
    case "SET_CURRENT_DIET":
      return Object.assign({}, state, {
        current: action.currentDiet,
      });
    case "SET_CURRENT_MACROS":
      return Object.assign({}, state, {
        currentMacros: action.macros
      });
    default:
      return state;
  }
}

export default diet;
