// @flow

import React from 'react';
import Button from 'react-native-button';
import calorieCalculator from 'libs/calorieCalculator';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';

class UpdateMeal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quantity: props.meal.quantity,
      calories: props.meal.calories,
      protein: props.meal.protein,
      fat: props.meal.fat,
      carbs: props.meal.carbs,
    }

    this.calculateQuantity = this.calculateQuantity.bind(this);
    this.calculateCalories = this.calculateCalories.bind(this);
    this.updateMeal = this.updateMeal.bind(this);
  }

  servingSize(meal, food) {
    let servingSize = food.servings.find(f => f.name === meal.serving);
    servingSize = servingSize ? servingSize.grams : meal.quantity;
    return servingSize;
  }

  calculateQuantity(quantity) {
    let { meal, food } = this.props;

    let servingSize = this.servingSize(meal, food);

    let q = quantity;
    if(meal.serving !== 'g') {
      q = quantity * servingSize;
    }

    let result = calorieCalculator.calculateQuantity(q, food.grams, {
      protein: food.protein,
      fat: food.fat,
      carbs: food.carbs,
      calories: food.calories
    });

    this.setState({
      quantity: quantity,
      calories: result.calories,
      protein: result.protein,
      fat: result.fat,
      carbs: result.carbs,
    });
  }

  calculateCalories(calories) {
    let { meal, food } = this.props;

    let servingSize = this.servingSize(meal, food);

    let s = food.grams;
    if(meal.serving !== 'g') {
      s = food.grams / servingSize;
    }

    let result = calorieCalculator.calculateCalories(calories, s, {
      protein: food.protein,
      fat: food.fat,
      carbs: food.carbs,
      calories: food.calories
    });

    this.setState({
      calories: calories,
      quantity: result.grams,
      protein: result.protein,
      fat: result.fat,
      carbs: result.carbs,
    });
  }

  updateMeal() {
    let { meal, mealNo } = this.props;

    meal.calories = this.state.calories;
    meal.protein = this.state.protein;
    meal.carbs = this.state.carbs;
    meal.fat = this.state.fat;
    meal.quantity = this.state.quantity;

    this.props.onPress(meal, mealNo);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', marginBottom: 5}}>
          <TextInput
            placeholder="Quantity"
            clearButtonMode="while-editing"
            keyboardType="numeric"
            onChangeText={(text) => this.calculateQuantity(text)}
            value={this.state.quantity.toString()}
            style={[styles.textInput, {marginRight: 1}]} />

          <View style={{flex: 0.6, flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{paddingLeft: 10}}>{this.props.meal.serving}</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          <TextInput
            placeholder="Calories"
            clearButtonMode="while-editing"
            keyboardType="numeric"
            onChangeText={(text) => this.calculateCalories(text)}
            value={this.state.calories.toString()}
            style={styles.textInput} />

          <View style={{flex: 0.6, flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{paddingLeft: 10}}>Calories</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', marginTop: 20, alignItems: 'center', marginBottom: 10}}>
          <Text style={{flex: 0.4, textAlign: 'center'}}>Protein: {`${this.state.protein}`}</Text>
          <Text style={{flex: 0.4, textAlign: 'center'}}>Fats: {`${this.state.fat}`}</Text>
          <Text style={{flex: 0.4, textAlign: 'center'}}>Carbs: {`${this.state.carbs}`}</Text>
        </View>

        <Button
          containerStyle={{backgroundColor: '#9ccb48', padding: 10, marginBottom: 20}}
          activeOpacity={0.8}
          onPress={this.updateMeal}
          style={{fontSize: 15, color: '#212121', flex: 1, alignSelf: 'stretch'}}>
          <Text style={{textAlign: 'center', color: '#FFFFFF', fontWeight: 'bold'}}>Update</Text>
        </Button>

      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#EBE9E9',
    padding: 5,
    paddingTop: 20,
    paddingBottom: 20,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  textInput: {
    height: 40,
    paddingLeft: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A4A4A4',
    flex: 0.4
  },
  selectStyle: {
    backgroundColor:'#FFFFFF',
    paddingLeft: 5,
    paddingRight: 3,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'flex-start'
  },
});

module.exports = UpdateMeal;
