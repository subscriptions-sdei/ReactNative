// @flow

let React = require('react');
var Icon = require('react-native-vector-icons/FontAwesome');
import { Actions } from 'react-native-router-flux';
import { TableView, Section, CustomCell } from 'react-native-tableview-simple'
import Dimensions from 'Dimensions';
let height = Dimensions.get('window').height

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView
} from 'react-native';

export default class MealSelect extends React.Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
    this.renderSelected = this.renderSelected.bind(this);
    this.state = {}
  }

  onPress(meal) {
    this.props.onChange(meal);
    this.props.closeModal();
  }

  renderSelected(meal) {
    let selected = this.state.selected;
    if(selected && selected === meal) {
      return (
        <Icon
          name='check'
          size={20}
          color='#9ccb48' />
      )
    }
    return null;
  }

  renderCell(meal) {
    return (
      <CustomCell key={meal} onPress={() => this.onPress(meal)}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 0.6}}>
            <Text style={{fontSize: 16}}>{meal}</Text>
          </View>

          <View>
            {this.renderSelected(meal)}
          </View>
        </View>
      </CustomCell>
    )
  }

  render() {
    const rows = [];
    for (i = 1; i <= this.props.meals; i++) {
      rows.push(this.renderCell(i));
    }

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TableView>
          <Section header="Select a meal">
            {rows}
          </Section>
        </TableView>
      </ScrollView>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    marginTop: 10,
    height: height
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
});
