// @flow

import React from 'react';
import { connect } from 'react-redux';

import {
  fetchFoods,
  shortListSearch,
  fetchShortListedFoods,
  shortListFood,
  removeFoodFromShortList
} from 'reducers/foodSearch/foodSearchActions';

import {
  StyleSheet,
  View,
  Text,
  SegmentedControlIOS
} from 'react-native';

import ShortListSearch from 'components/client/shortlist/ShortListSearch';
import FavouriteFoods from 'components/client/shortlist/FavouriteFoods';

class ShortListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedIndex: 0 };

    this.loadFoods = this.loadFoods.bind(this);
    this.loadShortList = this.loadShortList.bind(this);
    this.addFoodToShortList = this.addFoodToShortList.bind(this);
    this.removeFood = this.removeFood.bind(this);
  }

  loadFoods() {
    const user = this.props.user;
    this.props.dispatch(fetchShortListedFoods(user.email));
  }

  loadShortList() {
    this.loadFoods();
  }

  removeFood(foodId) {
    const user = this.props.user;
    this.props.dispatch(removeFoodFromShortList(foodId, user));
  }

  addFoodToShortList(foodId) {
    const user = this.props.user;
    this.props.dispatch(shortListFood(foodId, user));
  }

  render() {
    let components = {
      0: () => (
        <ShortListSearch
          foods={this.props.excludedFoods}
          loadFoods={this.loadFoods}
          shortListFood={(foodId) => this.addFoodToShortList(foodId)} />
      ),
      1: () => (
        <FavouriteFoods
          foods={this.props.shortListedFoods}
          loadFoods={this.loadShortList}
          removeFromShortList={(foodId) => this.removeFood(foodId)} />
      )
    }

    let component = components[this.state.selectedIndex]();

    return (
      <View style={styles.container}>
        <View style={styles.segmentContainer}>
          <SegmentedControlIOS
            values={['Search', 'Favourites']}
            tintColor="#22BCED"
            selectedIndex={this.state.selectedIndex}
            onChange={(event) => {
              this.setState({ selectedIndex: event.nativeEvent.selectedSegmentIndex });
            }} />
        </View>

        {component}
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    marginTop: 64,
  },
  segmentContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 6,
    borderBottomColor: '#BBBBBB',
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF'
  }
});

function mapStateToProps(state) {
  let { user, foods: { excludedFoods, shortListedFoods } } = state;

  return { user, excludedFoods, shortListedFoods };
}

module.exports = connect(mapStateToProps)(ShortListContainer);
