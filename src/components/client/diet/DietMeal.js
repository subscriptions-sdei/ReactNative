// @flow

import React from 'react';
import { Actions } from 'react-native-router-flux';
import api from 'libs/api';
import { percentageToServingSize } from 'libs/foodSwapConverter';

import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Animated,
  Dimensions
} from "react-native";

import Icon from 'react-native-vector-icons/FontAwesome';

let { width } = Dimensions.get('window');
width = width - 50;

export default class DietMeal extends React.Component {
  constructor(props) {
    super(props);
    this.renderFoodSwapButton = this.renderFoodSwapButton.bind(this);
    this.fetchFood = this.fetchFood.bind(this);
    this.renderMealInfo = this.renderMealInfo.bind(this);

    this.state = {
      widthCrossout: new Animated.Value(props.mealFood.selected ? width : 0),
      done: !!props.mealFood.selected,
      color: !!props.mealFood.selected ? '#ccc' : '#000',
    };
  }

  componentWillMount() {
    this.fetchFood(this.props.mealFood);
  }

  onSelectFood(mealFood, mealNo) {
    mealFood.selected = !mealFood.selected;
    this.props.onSelectFood(mealFood, mealNo);
  }

  onFoodSwap(food, mealNo) {
    Actions.foodSwap({ food: food, mealNo: mealNo });
  }

  fetchFood(mealFood) {
    this.setState({ loading: true });

    api.getDocument(mealFood.foodId)
      .then((food) => {
        this.setState({ food: food, loading: false });
      });
  }

  renderFoodSwapButton(mealFood, mealNo) {
    const food = this.state.food;

    if(food && food.categories.includes('supplement'))
      return null;

    return (
      <TouchableHighlight
        key={`${mealNo}-${mealFood.foodId}`}
        underlayColor="#B1B1B1"
        style={{
          borderRadius: 50,
          borderWidth: 1,
          backgroundColor:'#F49914',
          borderStyle: 'solid',
          borderColor: '#F49914',
          overflow:'hidden'
        }}
        onPress={() => this.onFoodSwap(mealFood, mealNo)}>
        <View>
          <Icon name="exchange" size={15} style={{ padding: 5 }} color='#fff' />
        </View>
      </TouchableHighlight>
    )
  }

  renderMealInfo(mealFood) {
    const quantity = mealFood.quantity;
    let serving = '0';
    const grams = mealFood.grams
    const food = this.state.food;

    if (mealFood.viewAsGrams) {
      serving = `${Math.round(grams)} g`;
    } else {
      const percentage = Math.round(grams / food.servings[0].grams * 100);
      serving = `${percentageToServingSize(percentage)} ${food.servingName}`;
    }

    return(
      <View style={{ flex: 0.3, flexDirection: "column" }}>
        <Text style={{ marginBottom: 2, fontSize: 12, color: this.state.color }}>
          {mealFood.name}
        </Text>
        <Text style={{ fontSize: 10, color: this.state.color }}>
          {serving}
        </Text>
      </View>
    )
  }

  render() {
    const { mealFood, mealNo } = this.props;

    if(this.state.loading)
      return null;

    const content = (
      <View style={styles.header}>
        {this.renderMealInfo(mealFood)}

        <View style={{ flexDirection: "row", flex: 0.4, alignItems: "center" }}>
          <View style={{ flex: 0.2, alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: this.state.color }}>
              {Math.round(mealFood.calories)}
            </Text>
          </View>
          <View style={{ flex: 0.3, alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: this.state.color }}>
              {Math.round(mealFood.protein)}
            </Text>
          </View>
          <View style={{ flex: 0.2, alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: this.state.color }}>
              {Math.round(mealFood.carbs)}
            </Text>
          </View>
          <View style={{ flex: 0.2, alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: this.state.color }}>
              {Math.round(mealFood.fat)}
            </Text>
          </View>
          <View style={{ flex: 0.2, alignItems: "center" }}>
            {this.renderFoodSwapButton(mealFood, mealNo)}
          </View>
        </View>

        <Animated.View style={[styles.crossOut, { width: this.state.widthCrossout, borderBottomColor: this.state.color }]} />
      </View>
    )

    return (
      <View key={`${mealFood._id}-${mealNo}`}>
        <TouchableHighlight
          underlayColor="#B1B1B1"
          onPress={() => {
            this.state.widthCrossout.setValue(this.state.done ? width : 0);
            Animated.timing(
              this.state.widthCrossout, {
                toValue: this.state.done ? 0 : width
              }
            ).start(() => {
              this.setState({
                color: !this.state.done ? '#ccc' : '#000',
                done: !this.state.done
              });
              this.onSelectFood(mealFood, mealNo);
            })
          }}>
          {content}
        </TouchableHighlight>
      </View>
    )
  }
}

let styles = {
  header: {
    flexDirection: "row",
    padding: 5,
    paddingVertical: 10,
    backgroundColor:'#F8F8F8'
  },
  crossOut: {
    marginHorizontal: 5,
    top: 26,
    flex: 0,
    borderBottomWidth: 1,
    position: 'absolute'
  }
};
