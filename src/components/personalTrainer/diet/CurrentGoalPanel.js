// @flow

import React from 'react';

import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Menu, { MenuOptions, MenuOption, MenuTrigger } from 'react-native-menu';

export default class CurrentGoalPanel extends React.Component {
  round(value) {
    return Math.round((value || 0) * 10) / 10;
  }

  renderRow = (title, calories, protein, carbs, fat) => {
    let rowStyle = (title === 'Current') ? 'currentRow' : 'goalRow';

    return(
      <View style={[styles.row, styles[rowStyle]]}>
        <View style={styles.currentBox}>
          <Text style={{color: '#FFFFFF', fontWeight: 'bold', paddingVertical: 1, fontSize: 13}}>{title}</Text>
        </View>

        <View style={{flex: 0.6, flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text style={styles.currentText}>{this.round(calories)}</Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text style={styles.currentText}>{this.round(protein)}</Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text style={styles.currentText}>{this.round(carbs)}</Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text style={styles.currentText}>{this.round(fat)}</Text>
          </View>
        </View>
      </View>
    )
  }

  renderDifference = (current, goal) => {
    const caloriesDiff = this.round(goal.calories - current.calories);
    const proteinDiff = this.round(goal.protein - current.protein);
    const carbsDiff = this.round(goal.carbs - current.carbs);
    const fatDiff = this.round(goal.fat - current.fat);

    const diffTextStyle = (macro) => { return (macro >= 0) ? 'positiveDiffText' : 'negativeDiffText' };
    const diffText = (macro) => { return (macro === 0) ? {macro} : (macro > 0 ? `+${macro}` :  `${macro}`) };

    return (
      <View style={[styles.row, styles.diffRow]}>
        <View style={styles.diffBox}>
          <Text style={{color: '#FFFFFF', fontWeight: 'bold', paddingVertical: 1, fontSize: 13}}>Difference</Text>
        </View>

        <View style={{flex: 0.6, flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text style={styles[diffTextStyle(caloriesDiff)]}>{diffText(caloriesDiff)}</Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text style={styles[diffTextStyle(proteinDiff)]}>{diffText(proteinDiff)}</Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text style={styles[diffTextStyle(carbsDiff)]}>{diffText(carbsDiff)}</Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text style={styles[diffTextStyle(fatDiff)]}>{diffText(fatDiff)}</Text>
          </View>
        </View>
      </View>
    )
  }

  renderAddToMealRow = () => {
    var elementMenuOptions = []

    for(let i = 1; i <= this.props.totalMeals; i++) {
      elementMenuOptions.push(
        <MenuOption key={i} value={i}><Text>{i}</Text></MenuOption>
      )
    }

    let elementMenuPlacing = -((elementMenuOptions.length - 4) * 50)

    return(
      <View style={[styles.row, styles.addToMealRow]}>
        <Text style={styles.addToMealText}>You are adding to meal:</Text>
        <Menu onSelect={(value) => {
            this.props.mealNo(value)
        }}>
          <MenuTrigger>
            <View style={{ flex: 1 }}>
              <View style={styles.mealtypeContainer}>
                <View style={{ flex: 1 }}>
                  <Text>{this.props.mealNo()}</Text>
                </View>
                <View
                  style={styles.mealtypeIcon}>
                  <Icon name="caret-down" style={{alignSelf:'center',marginTop: 3}} color="#000"/>
                </View>
              </View>
            </View>
          </MenuTrigger>
          <MenuOptions optionsContainerStyle={{width:50,marginTop: elementMenuPlacing }}>
            {elementMenuOptions}
          </MenuOptions>
        </Menu>
      </View>
    )
  }

  render() {
    let { goal, current } = this.props;

    let diff = {
      calories: goal.calories - current.calories,
      protein: goal.protein - current.protein,
      carbs: goal.carbs - current.carbs,
      fat: goal.fat - current.fat
    }

    return (
      <View style={styles.container}>

        {this.renderAddToMealRow()}

        <View style={[styles.row, styles.headerRow]}>
          <View style={{flex: 0.2}}></View>
          <View style={{flex: 0.6, flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 0.2, alignItems: 'center', borderBottomColor: '#FFFFFF'}}>
              <Text style={styles.headerText}>Cals</Text>
            </View>
            <View style={{flex: 0.2, alignItems: 'center'}}>
              <Text style={styles.headerText}>Protein</Text>
            </View>
            <View style={{flex: 0.2, alignItems: 'center'}}>
              <Text style={styles.headerText}>Carbs</Text>
            </View>
            <View style={{flex: 0.2, alignItems: 'center'}}>
              <Text style={styles.headerText}>Fat</Text>
            </View>
          </View>
        </View>

        {this.renderRow('Current', current.calories, current.protein, current.carbs, current.fat)}
        {this.renderRow('Goal', goal.calories, goal.protein, goal.carbs, goal.fat)}
        {this.renderDifference(current, goal)}
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    backgroundColor: '#3bbee9',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 12,
    backgroundColor: '#FF992E',
    fontWeight: 'bold',
    padding: 3,
    paddingLeft: 7,
    paddingRight: 7
  },
  row: {
    flexDirection: 'row',
    padding: 5
  },
  addToMealRow: {
    backgroundColor: '#13C7C8'
  },
  addToMealText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  headerRow: {
    paddingTop: 7,
    paddingBottom: 7,
    backgroundColor: '#07A9AB'
  },
  currentRow: {
    backgroundColor: '#13C7C8'
  },
  goalRow: {
    backgroundColor: '#07A9AB'
  },
  diffRow: {
    backgroundColor: '#13C7C8',
    paddingTop: 8,
    paddingBottom: 8
  },
  currentBox: {
    flex: 0.2,
    alignItems: 'center',
    borderRadius: 4
  },
  currentText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold'
  },
  diffBox: {
    flex: 0.2,
    backgroundColor: '#FF992E',
    alignItems: 'center',
    borderRadius: 4
  },
  negativeDiffText: {
    color: '#b22024',
    fontSize: 12,
    fontWeight: 'bold'
  },
  positiveDiffText: {
    color: '#c8fca4',
    fontSize: 12,
    fontWeight: 'bold'
  },
  mealtypeContainer: {
    height: 18,
    backgroundColor: 'white',
    paddingVertical: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
    marginLeft: 15,
    flex: 0,
    width: 45
  },
  mealtypeIcon: {
    flex: 0,
    width:10,
    height:8
  }
});
