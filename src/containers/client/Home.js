// @flow

import React from 'react'
import {View, ListView, StyleSheet, Text, StatusBar, TouchableHighlight} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

class Home extends React.Component {
  componentWillMount() {
    this.checkViewTutorial();
  }

  checkViewTutorial () {
      const viewTutorial = this.props.user.viewedTutorial;
      if(!viewTutorial) {
        Actions.tutorial();
      }
  }

  renderRow(rowData) {
    return (
      <TouchableHighlight underlayColor='#b1b1b1' onPress={rowData.onPress}>
        <View style={styles.rowContainer}>
          <Icon
            name={rowData.icon}
            size={25}
            color='#F49914' />
          <Text style={styles.rowTitle}>{rowData.title}</Text>
          <Icon
            style={styles.rowCaret}
            name='caret-right'
            size={30}
            color='#F49914' />
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    StatusBar.setBarStyle('light-content', false);

    let selections = [
      // {title: 'Training', icon: 'user'}, TODO: Implement Client Training Screen
      {title: 'Diet', icon: 'cutlery', onPress: Actions.clientDiets}
    ];

    const ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2}).cloneWithRows(selections);

    return (
      <ListView
        style={styles.container}
        dataSource={ds}
        renderRow={this.renderRow} />
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    marginTop: 64
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc'
  },
  rowTitle: {
    fontSize: 20,
    marginLeft: 15
  },
  rowCaret: {
    position: 'absolute',
    right: 10,
    top: 18
  }
});

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Home)
