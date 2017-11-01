// @flow

var React = require('react');

import FoodSearchRow from 'components/personalTrainer/diet/FoodSearch/Row';

import {
  StyleSheet,
  View,
  Text,
  ListView,
  ScrollView,
  RefreshControl,
  TouchableHighlight

} from 'react-native';

import Swipeout from 'libs/Swipeout';

class FavouriteFoods extends React.Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.loadFoods = this.loadFoods.bind(this);

    this.state = { loading: false }
  }

  loadFoods(foodId) {
    this.props.loadFoods(foodId)
  }

  renderRow(food) {
    var swipeoutBtns = [
      {
        text: 'remove',
        backgroundColor: '#CB1414',
        onPress: () => this.props.removeFromShortList(food._id)
      }
    ]

    return(
      <Swipeout right={swipeoutBtns} autoClose={true}>
        <FoodSearchRow food={food} />
      </Swipeout>
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
    marginTop: 64
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

module.exports = FavouriteFoods;
