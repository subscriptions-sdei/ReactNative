// @flow

import React from 'react';
import { Actions } from 'react-native-router-flux';
import Clients from 'containers/personalTrainer/Clients';
import More from 'containers/personalTrainer/More';

import { View } from 'react-native';

export default class TabView extends React.Component{
  renderTab() {
    switch(this.props.name) {
      case 'clients':
        return <Clients {...this.props} />;
      case 'more':
        return <More {...this.props} />;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderTab()}
      </View>
    )
  }
}

let styles = {
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    marginTop: 64,
  },
};
