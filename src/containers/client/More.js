// @flow

import React from 'react';
import { logout } from 'reducers/auth/AuthActions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { TableView, Section, Cell } from 'react-native-tableview-simple';
import Dimensions from 'Dimensions';
let width = Dimensions.get('window').width;

import {
  ScrollView,
  StyleSheet,
} from 'react-native';

class More extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.dispatch(logout());
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <TableView>
          <Section header="Diet">
            <Cell cellStyle="Basic" title="Short List Foods" onPress={Actions.clientShortList} />
            <Cell cellStyle="Basic" title="Tutorial" onPress={Actions.tutorial} />
            <Cell cellStyle="Subtitle" title="Logout" detail="Sign out of application" onPress={this.logout} />
          </Section>
        </TableView>
      </ScrollView>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    marginTop: 64,
  },
});

module.exports = connect()(More);
