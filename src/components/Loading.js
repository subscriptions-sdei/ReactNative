// @flow

import React from "react";

import { ActivityIndicator } from "react-native";

export default class Loading extends React.Component {
  render() {
    return (
      <ActivityIndicator style={{flex: 1}} />
    );
  }
}
