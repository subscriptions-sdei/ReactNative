// @flow

import React from 'react';
import { Actions } from 'react-native-router-flux';

import { View, ScrollView } from 'react-native';
import { TableView, Section, Cell, CustomCell } from 'react-native-tableview-simple';

export default class ClientMenu extends React.Component{
  constructor(props) {
    super(props);
    this.navigateToDiet = this.navigateToDiet.bind(this);
  }

  navigateToDiet() {
    const client = this.props.client
    if(client.signUpCompleted)
      Actions.diet();
    else
      alert('This client has not completed signing up.')
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <TableView>
          <Section header="Client Menu">
            <Cell title="Diet" cellStyle="Basic" accessory="DisclosureIndicator" onPress={this.navigateToDiet} />
            <Cell title="Profile" cellStyle="Basic" accessory="DisclosureIndicator" onPress={Actions.clientProfile} />
          </Section>
        </TableView>
      </ScrollView>
    );
  }
}

let styles = {
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    marginTop: 64,
  },
};
