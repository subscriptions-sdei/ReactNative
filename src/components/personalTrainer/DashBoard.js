// @flow

import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

class Dashboard extends React.Component{
  constructor(props) {
    super(props);
  }

  renderContent() {
    switch(this.props.name) {
      case '_clients':
        let Clients = require('../../containers/personalTrainer/Clients');
        return <Clients {...this.props} />;
      case '_diet':
        let DietHistory = require("../../containers/personalTrainer/DietHistory");
        return <DietHistory {...this.props} />;
      case '_splits':
        return false;
      case '_exercise':
        return false;
      case '_more':
        let More = require('../../containers/personalTrainer/More');
        return <More {...this.props} />;
    }
  }

  render() {
    return (
      <View></View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },
});

module.exports = Dashboard;
