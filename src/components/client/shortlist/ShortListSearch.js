// @flow

import React from 'react';
import FoodSearchRow from 'components/personalTrainer/diet/FoodSearch/Row';

import {
  StyleSheet,
  View,
  Text,
  ListView,
  ScrollView,
  RefreshControl,
  TouchableHighlight,

} from 'react-native';

class ShortListSearch extends React.Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.shortListFood = this.shortListFood.bind(this);

    this.state = { loading: false }
  }

  componentWillMount() {
    this.props.loadFoods();
  }

  shortListFood(foodId) {
    this.props.shortListFood(foodId)
  }

  renderRow(food) {
    return(
      <TouchableHighlight
        underlayColor="#B1B1B1"
        onPress={() => this.shortListFood(food._id)}>

        <FoodSearchRow food={food} />
      </TouchableHighlight>
    )
  }

  render() {
    let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    dataSource = dataSource.cloneWithRows(this.props.foods || []);

    return(
      <ListView
        refreshControl={
          <RefreshControl
            refreshing={this.state.loading}
            onRefresh={this.props.loadFoods} />
        }
        renderScrollComponent={(props) => <ScrollView {...props} />}
        keyboardShouldPersistTaps="always"
        style={styles.refreshList}
        dataSource={dataSource}
        renderRow={this.renderRow}
        viewIsInsideTabBar={true}
        enableEmptySections={true} />
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    marginTop: 64,
  },
  refreshList: {
    paddingTop: 15,
    height: 200,
    flex: 1
  },
  listRow: {
    padding: 6,
    backgroundColor: '#ffffff',
    borderColor: '#BFBFBF',
    borderBottomWidth: 0.5,
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden'
  }
});

module.exports = ShortListSearch;
