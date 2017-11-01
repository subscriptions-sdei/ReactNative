// @flow

import React from 'react';
import calorieCalculator from 'libs/calorieCalculator';
import SelectServing from './SelectServing';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  TouchableHighlight
} from 'react-native';

export default class AccordionInput extends React.Component {
  constructor(props) {
    super(props);

    this.state  = {
      protein: props.food.protein || 0,
      fat: props.food.fat || 0,
      carbs: props.food.carbs || 0,
      calories: '',
      selectedServing: {
        name: 'g',
        quantity: props.food.grams
      },
      quantity: '0',
      loading: false
    }

    this.calculateQuantity = this.calculateQuantity.bind(this);
    this.calculateCalories = this.calculateCalories.bind(this);
    this.addToMeal = this.addToMeal.bind(this);
  }

  componentDidUpdate() {
    if (this.state.loading) {
      this.setState({ loading: false });
    }
  }

  onServingsChange(serving) {
    this.setState({ selectedServing: serving, loading: true });
  }

  calculateQuantity(quantity) {
    if (this.state.loading) return;
    if(quantity === undefined) return;

    this.setState({ loading: true });

    let serving = this.state.selectedServing;
    let { protein, carbs, fat, calories, grams } = this.props.food;

    if (quantity === '' || quantity === 0) {
      this.setState({
        calories: calories,
        fat: fat,
        carbs: carbs,
        protein: protein,
        loading: false,
        quantity: quantity
      });

      this.props.setMacros({
        calories: calories,
        protein: fat,
        carbs: carbs,
        fat: fat
      });

      return;
    }

    let q = quantity;
    if(serving.name !== 'g') {
      q = quantity * serving.quantity;
    }

    let result = calorieCalculator.calculateQuantity(q, grams, {
      protein: protein,
      fat: fat,
      carbs: carbs,
      calories: calories
    });

    this.setState({
      grams: q,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
      calories: result.calories,
      quantity: quantity
    });

    this.props.setMacros({
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat
    });
  }

  calculateCalories(calQuantity) {
    if (this.state.loading) return;
    this.setState({ loading: true });

    let serving = this.state.selectedServing;
    let { protein, carbs, fat, calories, grams } = this.props.food;

    if (calQuantity === '' || calQuantity == 0) {
      this.setState({
        calories: calories,
        fat: fat,
        carbs: carbs,
        protein: protein,
        loading: false,
        quantity: ''
      });

      this.props.setMacros({
        calories: calories,
        protein: protein,
        carbs: carbs,
        fat: fat
      });

      return;
    }

    let s = grams;
    if(serving.name !== 'g') {
      s = grams / serving.quantity
    }

    let result = calorieCalculator.calculateCalories(calQuantity, s, {
      protein: protein,
      fat: fat,
      carbs: carbs,
      calories: calories,
      grams: grams
    });

    this.setState({
      protein: result.protein,
      fat: result.fat,
      carbs: result.carbs,
      grams: result.grams,
      calories: calQuantity,
      quantity: result.grams
    });

    this.props.setMacros({
      calories: calQuantity,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat
    });
  }

  addToMeal() {
    const food = this.props.food;
    let { meal, grams, selectedServing, protein, fat, carbs, calories, quantity } = this.state;
    let foodForMeal = {};
    const mealNo = this.props.mealNo;

    if(grams >= 1 && mealNo >= 1) {
      foodForMeal = {
        foodId: food._id,
        protein,
        fat,
        carbs,
        calories,
        grams,
        quantity,
        meal: mealNo,
        serving: selectedServing
      }

      let result = this.props.addFoodToMeal(foodForMeal, mealNo);
      if(result) {
        Alert.alert('', `Added to meal ${mealNo}`);
        this.setState({protein: '', fat: '', carbs: '', grams: '', calories: '', quantity: ''});
      } else {
        Alert.alert('', `${food.name} already added to meal ${mealNo}`);
      }
    } else {
      Alert.alert('', 'Enter quantity/calories and meal');
    }
  }

  render() {
    let selectedServing = this.state.selectedServing;

    return (
      <View style={[styles.container]}>
        <View style={styles.quantityRow}>
          <Text style={{flex: 0.2, marginLeft: 70, marginTop: 9}}>Quantity:</Text>
          <View style={{flex: 0, width: 100, marginLeft: -5}}>
            <TextInput
              placholder="Quantity"
              clearButtonMode="while-editing"
              keyboardType="numeric"
              selectTextOnFocus={true}
              onChangeText={(val) => this.calculateQuantity(val)}
              value={this.state.quantity.toString()}
              defaultValue={0}
              style={[styles.textInput, {marginRight: 1}]} />
          </View>

          <View style={{flex: 0.4, marginLeft: -15}}>
            <SelectServing
              food={this.props.food}
              title={selectedServing.name}
              quantity={selectedServing.quantity}
              onChange={(e) => this.onServingsChange(e)} />
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text style={{flex: 0.2, marginLeft: 120, marginTop: 9}}>=</Text>
          <View style={{flex: 0, width: 100, marginLeft: -27}}>
            <TextInput
              placeholder="Calories"
              clearButtonMode="while-editing"
              keyboardType="numeric"
              selectTextOnFocus={true}
              onChangeText={(val) => this.calculateCalories(val)}
              value={this.state.calories}
              defaultValue={0}
              style={styles.textInput} />
          </View>

          <View style={{flex: 0.3, flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{paddingLeft: 5}}>Calories</Text>
          </View>

          <View style={{backgroundColor: '#C2D545', alignItems: 'center', justifyContent: 'center'}}>
            <TouchableHighlight onPress={this.addToMeal} style={{paddingVertical: 5, paddingHorizontal: 10}}>
              <Text style={{color:'#fff',fontWeight:'bold'}}>ADD +</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F8',
    padding: 5,
    paddingTop: 20,
    paddingBottom: 20,
    borderColor: '#BFBFBF',
    borderBottomWidth: 0.3
  },
  quantityRow: {
    flexDirection: 'row',
    marginBottom: 5
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A4A4A4',
    flex: 0.4,
    height: 40,
    paddingVertical: 5,
    textAlign: 'center'
  }
});
