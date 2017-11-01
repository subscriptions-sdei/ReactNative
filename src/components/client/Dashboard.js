// @flow

let React = require('react');

import {
  View,
  Text,
  StyleSheet
} from 'react-native'

class Dashboard extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text>Client Dashboard</Text>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1'
  }
});

module.exports = Dashboard;
