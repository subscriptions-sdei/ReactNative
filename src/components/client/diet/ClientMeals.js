// @flow

import React from 'react';
import DietMeal from './DietMeal';

import {
  View,
  Text,
  ListView,
  ScrollView,
  StyleSheet,
} from 'react-native';

export default class ClientMeals extends React.Component {
  constructor(props) {
    super(props);

    this.sectionHeader = this.sectionHeader.bind(this);
    this.renderRow = this.renderRow.bind(this);

    let dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });

    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections(props.meals),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(nextProps.meals)
    });
  }

  sectionHeader(sectionData, sectionID) {
    const mealNo = sectionID;

    let addMacros = (previous, current) => { return (parseFloat(previous) + parseFloat(current)).toFixed(1) }

    let totals = sectionData.reduce((previous, current) => {
      return {
        calories: addMacros(previous.calories, current.calories),
        protein: addMacros(previous.protein, current.protein),
        carbs: addMacros(previous.carbs, current.carbs),
        fat: addMacros(previous.fat, current.fat),
        quantity: addMacros(previous.quantity, current.quantity),
      }
    });

    let prepostLabel: string = '';
    const mealno: number = parseInt(mealNo);
    prepostLabel = mealno === this.props.user.preWorkoutMeal ? ' (Preworkout)' : mealno === this.props.user.postWorkoutMeal ? ' (Postworkout)' : '';

    return (
      <View style={styles.sectionHeader}>
        <Text style={[styles.mealRowText, {flex: 0.3}]}>Meal {mealNo}<Text style={{fontSize:11}}>{prepostLabel}</Text></Text>

        <View style={{flex: 0.4, flexDirection: "row", alignItems: "center"}}>
          <View style={{flex: 0.2, alignItems: "center"}}>
            <Text style={styles.mealRowText}>{Math.round(totals.calories)}</Text>
          </View>
          <View style={{flex: 0.3, alignItems: "center"}}>
            <Text style={styles.mealRowText}>{Math.round(totals.protein)}</Text>
          </View>
          <View style={{flex: 0.2, alignItems: "center"}}>
            <Text style={styles.mealRowText}>{Math.round(totals.carbs)}</Text>
          </View>
          <View style={{flex: 0.2, alignItems: "center"}}>
            <Text style={styles.mealRowText}>{Math.round(totals.fat)}</Text>
          </View>
          <View style={{flex:0.2, alignItems: "center"}}>
          </View>
        </View>
      </View>
    )
  }

  renderRow(mealFood, mealNo, rowID, highlightRow) {
    return (
      <DietMeal
        key={`${mealFood.foodId}-${mealNo}`}
        mealNo={mealNo}
        mealFood={mealFood}
        substituteFoodsForFood={this.props.substituteFoodsForFood}
        foodSubstitutes={this.props.foodSubstitutes}
        onSelectFood={this.props.onSelectFood}
        substituteFood={this.props.substituteFood} />
    )
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderSectionHeader={this.sectionHeader}
        renderRow={this.renderRow}
      />
    )
  }
}

let styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    backgroundColor: "#13C7C8",
    paddingLeft: 5,
    paddingRight: 5,
    paddingVertical: 15
  },
  mealRowText: {
    flex: 0.1,
    color: "white",
  }
});
