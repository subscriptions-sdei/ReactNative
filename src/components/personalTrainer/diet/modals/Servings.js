// @flow

import React from 'react';
import { Actions } from 'react-native-router-flux';
import { CustomCell, Section, TableView } from 'react-native-tableview-simple';
import Dimensions from 'Dimensions';
let height = Dimensions.get('window').height

import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  ScrollView
} from 'react-native';

class Servings extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(name, quantity) {
    this.props.onChange({name: name, quantity: quantity});
    this.props.closeModal();
  }

  renderCell(serving, index) {
    return (
      <CustomCell
        key={index}
        onPress={() => this.onChange(serving.name, serving.grams)}>

        <View style={{flex: 1}}>
          <Text style={{fontSize: 16}}>{`${serving.name}`}</Text>
        </View>

      </CustomCell>
    )
  }

  render() {
    let { food } = this.props;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TableView>
          <Section header={food.name}>

            <CustomCell onPress={() => this.onChange('g', food.grams)}>
              <View style={{flex: 1}}>
                <Text style={{fontSize: 16}}>{'g'}</Text>
              </View>
            </CustomCell>

            {food.servings && food.servings.map((serving, i) =>
              {return this.renderCell(serving, i)}
            )}

          </Section>
        </TableView>
      </ScrollView>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height - 72,
  },
});

module.exports = Servings;
