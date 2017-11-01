// @flow

import React from 'react';
import { TableView, Section, CustomCell } from 'react-native-tableview-simple'
import Dimensions from 'Dimensions';
import { Actions } from 'react-native-router-flux';
import DietActions from 'actions/DietActions';
import Swipeout from 'libs/Swipeout';

let width = Dimensions.get('window').width;

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
} from 'react-native';

class Calories extends React.Component {
  constructor(props) {
    super(props);
  }

  delete(index) {
    this.props.dispatch(DietActions.deleteCalorie(index));
  }

  addSplit() {
    let calories = this.props.diet.calories;
    calories.push('');
    this.props.dispatch(DietActions.assignCalories(calories));
  }

  updateCalories(cal, index) {
    let calories = this.props.diet.calories;
    calories[index] = cal
    this.props.dispatch(DietActions.assignCalories(calories));
  }

  renderCell(c, i) {
    return(
      <CustomCell key={i} onPress={() => this[`cal_${i}`].focus() }>
        <Text style={{flex: 0.5, fontSize: 16}}>Split {i + 1}</Text>
        <TextInput
          ref={(ref) => this[`cal_${i}`] = ref }
          style={styles.cell}
          value={`${c}`}
          clearButtonMode='while-editing'
          onChangeText={(val) => this.updateCalories(val, i)}
          keyboardType="number-pad" />
      </CustomCell>
    );
  }

  renderRow(c, i) {
    let swipeoutBtns = [
      {
        text: 'Delete',
        backgroundColor: '#CB1414',
        onPress: () => { this.delete(i) }
      }
    ]

    if(i === 0) {
      return this.renderCell(c, i);
    } else {
      return (
        <Swipeout key={i} backgroundColor="#ffffff" right={swipeoutBtns} autoClose={true}>
          {this.renderCell(c, i)}
        </Swipeout>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="always" style={{width: width}}>
          <TableView>
            <Section header="Calories for Split">
              {this.props.diet.calories.map((c, i) => (
                this.renderRow(c, i)
              ))}
            </Section>
          </TableView>
        </ScrollView>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    marginTop: 64,
  },
  cell: {
    flex: 0.5,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    color: '#989393',
    width: 45
  }
});

module.exports = Calories;
