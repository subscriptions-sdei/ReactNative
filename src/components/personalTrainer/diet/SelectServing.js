// @flow

import React from 'react';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import Servings from './modals/Servings';

import {
  View,
  Text
} from 'react-native'

export default class SelectServing extends React.Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    let component = <Servings food={this.props.food} onChange={this.props.onChange} />
    Actions.modalBox({modalComponent: component, title: 'Servings'});
  }

  render() {
    let title = this.props.title || 'g';

    return (
      <Button
        containerStyle={styles.buttonContainer}
        style={{fontSize: 14, color: '#212121'}}
        styleDisabled={{color: 'red'}}
        onPress={this.onPress} >
        {title}
      </Button>
    )
  }
}

let styles = {
  buttonContainer: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#A4A4A4',
    marginLeft: 20,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#E4E4E4'
  }
}
