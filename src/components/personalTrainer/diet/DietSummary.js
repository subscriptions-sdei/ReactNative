// @flow

import React from 'react';

import { currentDiet, updateDiet, currentMacros } from 'actions/DietActions';
import MealList from './MealList';
import Button from 'react-native-button';

import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  Alert
} from 'react-native';

class DietSummary extends React.Component {
  constructor(props) {
    super(props);
    this.foodsForMeal = this.foodsForMeal.bind(this);
    this.deleteFromMeal = this.deleteFromMeal.bind(this);
    this.updateMeal = this.updateMeal.bind(this);
    this.completeMeal = this.completeMeal.bind(this);
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.state = { lastOpenAccordion:undefined };
  }

  foodsForMeal(meals) {
    return this.props.foods.foods.filter(food => meals.find(m => m.foodId === food._id) )
  }

  deleteFromMeal(meal, food) {
    let currentDiet = this.props.diet.current;
    let calories = Object.keys(currentDiet.calories);
    let meals = currentDiet.calories[calories[0]].meals[meal];

    let filteredfoods = meals.filter((f) => f.foodId !== food.foodId);
    currentDiet.calories[calories[0]].meals[meal] = filteredfoods;

    if(currentDiet.calories[calories[0]].meals[meal].length === 0) {
      delete currentDiet.calories[calories[0]].meals[meal]
    }

    if(Object.keys(currentDiet.calories[calories[0]].meals).length === 0) {
      currentDiet.calories[calories[0]].meals = {};
    }

    this.props.dispatch(updateDiet(currentDiet, this.props.currentClient));

    Alert.alert(`${food.name} removed`);
  }

  updateMeal(meal, mealNo) {
    let currentDiet = this.props.diet.current;
    let calories = Object.keys(currentDiet.calories);
    let currentMeals = currentDiet.calories[calories[0]].meals;
    let foodsForMeal = currentMeals[mealNo];
    let index = foodsForMeal.findIndex((m) => m.foodId === meal.foodId)

    // Update meal in diet
    currentDiet.calories[calories[0]].meals[mealNo][index] = meal;

    this.props.dispatch(updateDiet(currentDiet, this.props.currentClient));
    this.props.dispatch(currentMacros(currentDiet.calories));

    Alert.alert('Meal successfully updated');
  }

  completeMeal() {
    const currentClient = this.props.currentClient;
    const diet = this.props.diet.current;
    const keys = Object.keys(diet.calories);
    const meals = diet.calories[keys[0]].meals;
    const mealKeys = Object.keys(meals);
    const available = mealKeys.every((k) => meals[k].length >= 1);

    diet.available = available;
    this.props.dispatch(updateDiet(diet, currentClient));
  }

  toggleAccordion(accordionData) {
    if(this.state.lastOpenAccordion && this.state.lastOpenAccordion.state.isVisible
        && this.state.lastOpenAccordion.props.content.props.food._id != accordionData.props.content.props.food._id)
    {
      this.state.lastOpenAccordion.toggle();
    }
    this.setState({lastOpenAccordion: accordionData});
    const meal = accordionData.props.content.props.meal;
    const diet = this.props.diet.current;
    const keys = Object.keys(diet.calories);
    const meals = diet.calories[keys[0]].meals;
    let selectedItemIndex = 0;
    const itemKey = accordionData.props.content.props.mealNo;
    for (i = 1; i <= itemKey; i++) {
      if(meals[i].indexOf(meal) >= 0) {
        selectedItemIndex += meals[i].indexOf(meal);
      } else {
        selectedItemIndex += meals[i].length;
      }
    }
    if(selectedItemIndex >= 2) {
      this.refs.scrollView.scrollTo({x: 0, y: (selectedItemIndex * 60), animated: true});
    }
  }

  render() {
    const diet = this.props.diet.current;
    const keys = Object.keys(diet.calories);
    const meals = diet.calories[keys[0]].meals;
    let component = null;

    if(meals) {
      component = (
        <View>
          <View style={styles.rowHeader}>
            <Text style={{flex: 0.3, color: '#FFFFFF', fontWeight: 'bold', fontSize: 16}}>Meal</Text>

            <View style={{flex: 0.6, flexDirection: 'row'}}>
              <View style={{flex: 0.2, alignItems: 'center'}}>
                <Text style={styles.row}>Cals</Text>
              </View>
              <View style={{flex: 0.2, alignItems: 'center'}}>
                <Text style={styles.row}>Protein</Text>
              </View>
              <View style={{flex: 0.2, alignItems: 'center'}}>
                <Text style={styles.row}>Carbs</Text>
              </View>
              <View style={{flex: 0.2, alignItems: 'center'}}>
                <Text style={styles.row}>Fat</Text>
              </View>
            </View>
          </View>

          <ScrollView ref="scrollView" style={styles.mealLists} keyboardShouldPersistTaps="always">
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={65}>
              {Object.keys(meals).map((key) =>
                <MealList
                  key={key}
                  meal={key}
                  deleteFromMeal={this.deleteFromMeal}
                  meals={meals[key]}
                  updateMeal={this.updateMeal}
                  currentClient={this.props.currentClient}
                  toggleAccordion={this.toggleAccordion}
                  foods={this.foodsForMeal(meals[key])} />
              )}
            </KeyboardAvoidingView>

            <View style={{flex: 1, alignItems: 'center', marginBottom: 20}}>
              <Button
                onPress={this.completeMeal}
                style={{fontSize: 20, color: '#FFFFFF', backgroundColor: '#9ccb48', borderRadius: 4, width: 300, padding: 10}}>
                Save
              </Button>
            </View>

          </ScrollView>
        </View>
      )
    } else {
      component = <Text>No Meals</Text>
    }

    return (
      <View style={styles.container}>
        {component}
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mealLists: {
    paddingTop: 0,
  },
  rowHeader: {
    flexDirection: 'row',
    backgroundColor: '#828282',
    padding: 5,
    paddingVertical: 12
  },
  row: {
    flex: 0.2,
    color: '#FFFFFF',
    fontSize: 16
  }
});

module.exports = DietSummary;
