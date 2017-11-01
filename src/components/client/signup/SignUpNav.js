// @flow

let React = require('react');

import {
  View,
  Text,
  StyleSheet,
} from 'react-native'

export default class SignUpNav extends React.Component{

  render() {
    return (
      <View style={styles.navContainer}>
        <View style={styles.circle} />
        <View style={styles.circle} />
        <View style={styles.circle} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60
  },
  circle: {
    height: 10,
    width: 10,
    borderRadius: 50,
    borderColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  circleActive: {
    height: 10,
    width: 10,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
  }
});
