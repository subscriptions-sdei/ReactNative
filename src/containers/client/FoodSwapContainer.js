// @flow

import React from "react";
import { connect } from 'react-redux';
import FoodSwap from 'components/client/diet/FoodSwap';
import { fetchSubstituteFoods } from 'actions/ClientFoodSearch';
import { convertFood } from 'actions/FoodSwapActions';
import Dimensions from 'Dimensions';
let height = Dimensions.get('window').height;

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar
} from "react-native";

class FoodSwapContainer extends React.Component {
  componentWillMount() {
    this.substituteFoodsForFood(this.props.food.foodId);
  }

  substituteFoodsForFood = (foodId: string) => {
    this.props.dispatch(fetchSubstituteFoods(foodId))
  }

  convertFood = (mealNo, substitute, selectedFood, macros, viewAsGrams) => {
    let { diet, user } = this.props;
    this.props.dispatch(convertFood(diet, user, mealNo, substitute, selectedFood, macros, viewAsGrams))
  }

  renderHeader(food) {
    return (
      <View>
        <View style={styles.headTipContainer}>
          <Text style={styles.headTipText}>
            Food Swapper allows you to swap your assigned food with its equivalent
          </Text>
        </View>
        <View style={styles.headerContainer}>
          <Text style={{flex: 2, color: 'white'}}>FOOD</Text>
          <View style={{flex: 3, flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{flex: 1, color: 'white', textAlign: 'center'}}>CALS</Text>
            <Text style={{flex: 1, color: 'white', textAlign: 'center'}}>PROT</Text>
            <Text style={{flex: 1, color: 'white', textAlign: 'center'}}>CARBS</Text>
            <Text style={{flex: 1, color: 'white', textAlign: 'center'}}>FAT</Text>
          </View>
        </View>
        <View style={[styles.headerContainer, {backgroundColor:'#F8F8F8'}]}>
          <Text style={{flex: 2, fontSize: 10}}>{food.name}</Text>
          <View style={{flex: 3, flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{flex: 1, textAlign: 'center'}}>{Math.round(food.calories)}</Text>
            <Text style={{flex: 1, textAlign: 'center'}}>{Math.round(food.protein)}</Text>
            <Text style={{flex: 1, textAlign: 'center'}}>{Math.round(food.carbs)}</Text>
            <Text style={{flex: 1, textAlign: 'center'}}>{Math.round(food.fat)}</Text>
          </View>
        </View>
      </View>
    )
  }

  render() {
    StatusBar.setBarStyle('light-content', true);

    let { food, mealNo, foodSubstitutes, convertFood } = this.props;

    return (
      <View style={styles.container}>
        {this.renderHeader(food)}
        <ScrollView style={{ height: height - 160 }}>
          <FoodSwap
            selectedFood={food}
            mealNo={mealNo}
            foodSubstitutes={foodSubstitutes}
            convertFood={this.convertFood} />
        </ScrollView>
      </View>
    )
  }
}

let styles = {
  container: {
    marginTop: 70
  },
  foodTitle: {
    padding: 10,
    textAlign: 'center',
    fontSize: 15
  },
  macroNum: {
    fontWeight: 'bold'
  },
  macroText: {
    marginTop: 2,
    fontSize: 11
  },
  headTipContainer: {
    padding: 15,
    backgroundColor: 'white'
  },
  headTipText: {
    color: 'black'
  },
  headerContainer: {
    padding: 15,
    backgroundColor: '#13C7C8',
    flexDirection: 'row'
  }
};

function mapStateToProps(state) {
  let foodSubstitutes = state.clientFoodSearch.foodSubstitutes;

  return {
    user: state.user,
    foodSubstitutes: foodSubstitutes || [],
    diet: state.clientDiet.current
  }
}
export default connect(mapStateToProps)(FoodSwapContainer)
