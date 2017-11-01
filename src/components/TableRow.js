// @flow

import React from 'react';
import { CustomCell } from 'react-native-tableview-simple'

import {
  View,
  Text
} from 'react-native';

export default class TableRow extends React.Component {
  render() {
    let content;

    let children = this.props.children;
    if(!children)
      children = <Text style={[{fontSize: 16}, this.props.textStyle]}>{this.props.value}</Text>;

    if(this.props.description) {
      content = (
        <View style={styles.row}>
          <View style={{justifyContent: 'center', flexDirection: 'column', flex: 0.4}}>
            <Text style={{fontSize: 13}}>{this.props.title}</Text>
            <Text style={{fontSize: 9}}>{this.props.description}</Text>
          </View>
          <View style={{backgroundColor: 'white', width: 120, marginTop: 3, flex: 0.5}}>
            {children}
          </View>
        </View>
      )
    } else {
      content = (
        <View style={styles.row}>
          <View style={{justifyContent: 'center', flex: 0.4}}>
            <Text style={{fontSize: 15}}>{this.props.title}</Text>
          </View>
          <View style={{backgroundColor: 'white', flex: 0.5}}>
            {children}
          </View>
        </View>
      )
    }

    return <CustomCell onPress={this.props.onPress}>{content}</CustomCell>;
  }
}

const styles = {
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
}
