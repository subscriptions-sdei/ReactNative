// @flow

import React from 'react';
import { logout } from 'reducers/auth/AuthActions';
import codePush from "react-native-code-push";

import { TableView, Section, Cell, CustomCell } from 'react-native-tableview-simple';
import Dimensions from 'Dimensions';
let width = Dimensions.get('window').width;

import {
  StyleSheet,
  View,
  ScrollView,
  Text
} from 'react-native';

class More extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    this.props.dispatch(logout());
  }

  render() {
    return (
      <ScrollView style={styles.more}>
        <TableView>
          <Section header="Additional Options">
            <Cell cellStyle="Subtitle" title="Sync" detail="resync data for offline use" onPress={()=> alert('implement me!')} />
            <Cell cellStyle="Subtitle" title="Logout" detail="Sign out of application" onPress={this.handleLogout} />
          </Section>
        </TableView>
      </ScrollView>
    );
  }
}

let styles = StyleSheet.create({
  more: {
    width: width,
  }
});

module.exports = More;
