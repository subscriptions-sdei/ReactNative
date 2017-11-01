// @flow

import React from 'react';
import Dimensions from 'Dimensions';
let width = Dimensions.get('window').width;

import {
  View,
  StyleSheet
} from 'react-native';

export default class Form extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width
  }
});
