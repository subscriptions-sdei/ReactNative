// @flow

import React from 'react';
import Button from 'react-native-button';

import { Actions } from 'react-native-router-flux';

import { selectUserType } from 'reducers/auth/AuthActions';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

class SelectUserType extends React.Component {
  constructor(props) {
    super(props);

    this.btnStyle = this.btnStyle.bind(this);
    this.continue = this.continue.bind(this);
    this.state = { selectedBtn: 'client' };
  }

  componentWillMount() {
    Actions.refresh({ title: 'You are a',
                      navigationBarStyle: styles.navBarStyle,
                      titleStyle: styles.navTitleStyle });
  }

  continue() {
    this.props.dispatch(selectUserType(this.props.user, this.state.selectedBtn));
  }

  btnStyle(btn) {
    selected = this.state.selectedBtn === btn;

    return selected ? styles.selectedBtn : styles.unselectedBtn;
  }

  render() {
    let options = [{ title: 'Client' }, { title: 'Personal Trainer' }]
    return (
      <View style={styles.container}>

        <View style={styles.selections}>
          <Button
            onPress={() => this.setState({ selectedBtn: 'client' })}
            activeOpacity={1}
            style={this.btnStyle('client')}>
            Client
          </Button>

          <Text style={styles.selectionSeperator}>or</Text>

          <Button
            onPress={() => this.setState({ selectedBtn: 'personalTrainer' })}
            activeOpacity={1}
            style={this.btnStyle('personalTrainer')}>
            Personal Trainer
          </Button>
        </View>

        <Button
          onPress={this.continue}
          activeOpacity={1}
          style={{fontSize: 20, color: '#FF992E', backgroundColor: '#FFFFFF', borderRadius: 2, padding: 10}}>
          Continue
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 70,
    backgroundColor: '#22BCED',
  },
  selections: {
    flex:1,
    top: -40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  selectedBtn: {
    fontSize: 20,
    color: '#FFFFFF',
    backgroundColor: '#9ccb48',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 2,
    padding: 15,
    width: 200,
  },
  unselectedBtn: {
    fontSize: 20,
    color: '#FFFFFF',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 2,
    padding: 15,
    width: 200,
  },
  selectionSeperator: {
    color: '#FFFFFF',
    padding: 20,
    fontWeight: 'bold',
  },
  navBarStyle: {
    borderBottomWidth: 0,
    backgroundColor: '#22BCED',
    marginTop: 20,
  },
  navTitleStyle: {
    color: '#FFFFFF',
    fontSize: 25,
  }
});

module.exports = SelectUserType;
