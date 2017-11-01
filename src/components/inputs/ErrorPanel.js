// @flow

let React = require("react")

import {
  View,
  Text,
} from 'react-native';

class ErrorPanel extends React.Component {
  render() {
    if(this.props.errors) {
      return (
        <View style={{marginLeft: 15, marginBottom: 20}}>
          {this.props.errors.map((error, i) => {
            return <Text key={i} style={{fontWeight: 'bold', color: '#E9281C'}}>- {error}</Text>
          })}
        </View>
      )
    }

    return null;
  }
}

module.exports = ErrorPanel;
