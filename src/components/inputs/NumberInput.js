// @flow

let React = require("react")

import {
  TextInput,
} from 'react-native';

export default class NumberInput extends React.Component {
  render() {
    return (
      <TextInput
        style={{flex: 1, fontSize: 14}}
        autoCapitalize="none"
        editable={true}
        clearButtonMode="always"
        keyboardType="number-pad"
        {...this.props} />
    )
  }
}
