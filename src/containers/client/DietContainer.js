// @flow

import React from 'react';
import { connect } from 'react-redux';
import ClientMeals from 'components/client/diet/ClientMeals';
import Icon from 'react-native-vector-icons/FontAwesome';
import { updateDiet, currentDiet, completeDiet } from 'actions/ClientDietActions';

import {
  View,
  Text,
  ListView,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  StatusBar
} from 'react-native';

class DietContainer extends React.Component{
  constructor(props) {
    super(props);

    this.onSelectFood = this.onSelectFood.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderSubmit = this.renderSubmit.bind(this);
    this.renderCompletedRow = this.renderCompletedRow.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(currentDiet(this.props.dietId));
  }

  onSelectFood(food, mealNo) {
    const { user, diet, calories } = this.props;
    const meals = diet.calories[calories].meals;
    let dietCompleted = true;
    Object.keys(meals).forEach(mealNo => {
      meals[mealNo].forEach(food => {
        if(!food.selected)
          dietCompleted = false;
      });
    });

    const index = diet.calories[calories]
                      .meals[mealNo]
                      .findIndex(f => f.foodId === food.foodId);

    diet.calories[calories].meals[mealNo][index] = food;
    diet.completed = dietCompleted;
    this.props.dispatch(updateDiet(diet, user));
  }

  submit() {
    let { user, diet, calories } = this.props;
    let meals = diet.calories[calories].meals;
    let [completedFoods, totalFoods, percentageCompleted] = [0, 0, 0];

    Object.keys(meals).forEach(mealNo => {
      meals[mealNo].forEach(food => {
        ++totalFoods;

        if(food.selected)
          ++completedFoods;
      });
    });

    if(completedFoods > 0) {
      percentageCompleted = Math.round(completedFoods / totalFoods * 100);
    }

    diet.percentageCompleted = percentageCompleted;
    this.props.dispatch(completeDiet(diet, user));
  }

  renderHeader() {
    return (
      <View style={styles.rowHeader}>
        <Text style={[styles.rowText, { flex: 0.3 }]}>MEAL</Text>

        <View style={{flex: 0.4, flexDirection: 'row'}}>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text style={styles.rowText}>CALS</Text>
          </View>
          <View style={{flex: 0.3, alignItems: 'center'}}>
            <Text style={styles.rowText}>PROT</Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text style={styles.rowText}>CARBS</Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text style={styles.rowText}>FAT</Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}} />
        </View>
      </View>
    )
  }

  renderCompletedRow() {
    return (
      <View style={[styles.rowFooter, { backgroundColor:'#F49914' }]}>
        <Text style={[styles.rowText, { flex: 0.3 }]}>COMPLETED</Text>

        <View style={{flex: 0.4, flexDirection: 'row'}}>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text style={styles.rowText}>{Math.round(0.0)}</Text>
          </View>
          <View style={{flex: 0.3, alignItems: 'center'}}>
            <Text style={styles.rowText}>{Math.round(0.0)}</Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text style={styles.rowText}>{Math.round(0.0)}</Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text style={styles.rowText}>{Math.round(0.0)}</Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}} />
        </View>
      </View>
    )
  }

  renderSubmit() {
    return (
      <TouchableHighlight
        style={{ backgroundColor: '#EEEEEE', padding: 10 }}
        onPress={this.submit}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, color: '#C2D547', marginRight: 5, fontWeight: 'bold' }}>DAY COMPLETED</Text>
          <Icon
            name='caret-right'
            size={25}
            color='#C2D547' />
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    StatusBar.setBarStyle('light-content', true);

    if(!this.props.diet)
      return <View style={styles.container}><Text>Loading</Text></View>

    return(
      <View style={styles.container}>
        <Text style={{ fontSize: 20, padding: 20 }}>
          Select the foods you ate today
        </Text>

        <ScrollView keyboardShouldPersistTaps="always">
          <ClientMeals
            user={this.props.user}
            meals={this.props.meals}
            foodSubstitutes={this.props.foodSubstitutes}
            onSelectFood={this.onSelectFood} />
          {this.renderCompletedRow()}
        </ScrollView>
        {this.renderSubmit()}
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 64
  },
  rowHeader: {
    flexDirection: 'row',
    backgroundColor: '#07A9AB',
    padding: 5,
    paddingVertical: 12
  },
  rowText: {
    flex: 0.2,
    color: '#FFFFFF',
    fontSize: 13
  },
  rowFooter: {
    flexDirection: 'row',
    backgroundColor: '#626262',
    padding: 5,
    paddingVertical: 12
  }
});

function mapStateToProps(state) {
  const diet = state.clientDiet.current;

  let calories = null;
  let meals = null;

  if(diet) {
    calories = Object.keys(diet.calories)[0];
    meals = diet.calories[calories].meals;
  }

  return {
    user: state.user,
    diet: diet,
    calories: calories,
    meals: meals
  }
}

module.exports = connect(mapStateToProps)(DietContainer);
