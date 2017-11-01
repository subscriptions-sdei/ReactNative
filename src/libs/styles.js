// @flow

import React from 'react';

import {
  StyleSheet
} from 'react-native';

import Dimensions from 'Dimensions';
let height = Dimensions.get('window').height;

let GlobalStyles = StyleSheet.create({
  container: {
    height: height
  },
  navTopMargin: {
    marginTop: 40
  }
});

module.exports = GlobalStyles;
