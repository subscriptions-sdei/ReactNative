// @flow

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  PickerIOS,
  TouchableHighlight,
  TextInput
} from 'react-native'

import ScrollableTabView from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Mealtypes, Categories, CustomTabBar } from 'helpers'

export default class Filter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: Categories[this.props.category].key
    }

    this.filterCategory = this.filterCategory.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.mealType !== nextProps.mealType || this.props.category !== nextProps.category) {
      this.props.updateFilter(nextProps.category, nextProps.mealType);
      this.setState({
        tabIndex: Categories[nextProps.category].key
      })
    }
  }

  filterCategory(tab) {
    if (tab.i >= 0) {
      // Get category Object
      let category = Categories[Object.keys(Categories)[tab.i]]

      // Call method which will do the update on the list
      this.props.updateFilter(category.value, this.props.mealType);
    }
  }

  render() {
    return (
      <View style={styles.filterContainer}>
        <ScrollableTabView
          tabBarActiveTextColor="white"
          tabBarInactiveTextColor="#737373"
          initialPage={4}
          page={this.state.tabIndex}
          renderTabBar={() => <CustomTabBar backgroundColor="#13C7C8"/>}
          onChangeTab={this.filterCategory}>
          {Object.keys(Categories).map((key, i) => <Text key={key} tabLabel={Categories[key].label} style={styles.category}/>)}
        </ScrollableTabView>

        <View style={styles.categoryContainer}>
          <Text style={styles.mealTypeLabel}>Filter Meal Type:</Text>
          <View style={{ flex: 1 }}>
            <TouchableHighlight onPress={this.props.openMealTypeModal}>
              <View style={styles.mealtypeContainer}>
                <View style={{ flex: 2 }}>
                  <Text>
                    {Mealtypes[this.props.mealType].label}
                  </Text>
                </View>
                <View
                  style={styles.mealtypeIcon}>
                  <Icon name="caret-down" style={{alignSelf:'center',marginTop: 5}} color="#000"/>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  filterContainer: {
    flex: 1,
    overflow: 'visible'
  },
  categoryContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#13C7C8'
  },
  category: {
    flex: 0,
    height: 0
  },
  mealTypeLabel: {
    height: 30,
    padding: 5,
    color: 'white'
  },
  mealtypeContainer: {
    height: 30,
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row'
  },
  mealtypeIcon: {
    flex: 0,
    width:10,
    height:30
  }
});
