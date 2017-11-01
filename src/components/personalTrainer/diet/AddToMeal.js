// @flow

import React from 'react';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import MealSelect from './modals/MealSelect';

import {
  View,
  Text,
  TextInput,
} from 'react-native';

export default class AddToMeal extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onPress = this.onPress.bind(this);
    this.state = { selectedMeal: null }
  }

  onChange(value) {
    this.setState({ selectedMeal: value })
    this.props.onChange(value)
  }

  onPress() {
    let component = <MealSelect meals={this.props.meals} onChange={(value) => this.onChange(value)} />
    Actions.modalBox({ modalComponent: component, title: 'Meals' });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{flex: 0.2, paddingTop: 12, paddingLeft: 5}}>Add to Meal</Text>

        <Button
          containerStyle={styles.buttonContainer}
          style={{fontSize: 15, color: '#212121'}}
          onPress={(e) => this.onPress(this.props.meal)} >
          {this.state.selectedMeal || "Meal"}
        </Button>

        <Button
          containerStyle={styles.addToMealBtn}
          style={{fontSize: 15, color: '#212121'}}
          onPress={() => this.props.onPress(this.props.meal)} >
          <Icon
            name='check'
            style={{marginLeft: 3}}
            size={15}
            color='#FFFFFF' />
        </Button>
      </View>
    )
  }
}

let styles = {
  container: {
    flexDirection: 'row',
    marginTop: 20
  },
  textInput: {
    height: 40,
    paddingLeft: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A4A4A4',
    flex: 0.1
  },
  addToMealBtn: {
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#9ccb48',
    marginLeft: 20,
    flex: 0.02
  },
  buttonContainer: {
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#A4A4A4',
    marginLeft: 20,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#E4E4E4',
    paddingLeft: 20,
    paddingRight: 20,
  }
};
