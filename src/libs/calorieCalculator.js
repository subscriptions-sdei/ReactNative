// @flow

type MacroGramsType = {
  protein: string,
  fat: string,
  carbs: string,
  grams: string,
}

type MacroCaloriesType = {
  protein: string,
  fat: string,
  carbs: string,
  calories: string
}

type MacroType = {
  protein: string,
  fat: string,
  carbs: string,
}

class CalorieStrategy {
  constructor(gender: string) {
    this.gender = gender;
    this.bmr = 0;
    this.tdee = 0;
    this.calories = 0;
  }

  calculateCalories(options = {}) {
    if(this.gender === 'male') {
      return this.calculateMenCalories(options);
    } else {
      return this.calculateFemaleCalories(options);
    }
  }

  activityLevels(level) {
    const levels = {
      0: 1.2, // Sedentary
      1: 1.3, // Light Activity
      2: 1.5, // Active
      3: 1.7, // Very Active
      4: 1.9  // Extremely Active
    }
    return levels[level];
  }

  goals(goal) {
    let goals = {
      0: (1 + 0.15),  // Increase muscle mass
      1: (1 - 0.2),   // Reduce Body Fat
      2: (1)          // Maintan Weight
    }
    return goals[goal];
  }

  calculateMenCalories(options): number {
    let { weight, height, age, goal, activity } = options;

    this.bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    this.tdee = this.bmr * this.activityLevels(activity);
    this.calories = this.goals(goal) * this.tdee;

    return Math.round(this.calories);
  }

  calculateFemaleCalories(options): number {
    let { weight, height, age, goal, activity } = options;

    this.bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    this.tdee = this.bmr * this.activityLevels(activity);
    this.calories = this.goals(goal) * this.tdee;

    return Math.round(this.calories);
  }
}

module.exports = {
  CalorieStrategy,

  calculateQuantity(quantity: number, grams: number, macros: any): MacroCaloriesType {
    let q = +quantity;

    let protein = macros.protein / grams * q;
    let fat = macros.fat / grams * q;
    let carbs = macros.carbs / grams * q;
    let calories = macros.calories / grams * q;

    if(calories % 1 !== 0) { calories = calories; }

    return {
      protein: protein.toFixed(1),
      carbs: carbs.toFixed(1),
      fat: fat.toFixed(1),
      calories: calories.toFixed(1),
    }
  },

  calculateCalories(calories: number, inputGrams: number, macros: any): MacroGramsType {
    let c = parseFloat(calories) || 0;

    let protein = (macros.protein / macros.calories * c) || 0;
    let fat = (macros.fat / macros.calories * c) || 0;
    let carbs = (macros.carbs / macros.calories * c) || 0;
    let grams = (inputGrams / macros.calories * c) || 0;
    grams = isFinite(grams) ? grams : 0;

    return {
      protein: protein.toFixed(1),
      fat: fat.toFixed(1),
      carbs: carbs.toFixed(1),
      grams: grams.toFixed(1)
    }
  },

  calculateMacros(weight: number, calories: number): MacroType {
    let macros = {
      protein: 4,
      fat: 9,
      carbs: 4
    };

    let protein = Math.round(weight * 2.2);
    let fat = Math.round(weight * 0.9);
    let carbsCalories = (protein * macros.protein) + (fat * macros.fat);
    let carbs = Math.round((calories - carbsCalories) / 4) || '';

    return {
      protein: protein.toString(),
      fat: fat.toString(),
      carbs: carbs.toString()
    }
  }
}
