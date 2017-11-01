// @flow

import React from "react";
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import { fetchClients } from 'actions/ClientActions';
import { currentClient } from 'actions/CurrentClientActions';
import { fetchDiets } from 'actions/DietActions';

import Dimensions from 'Dimensions';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

import {
  View,
  Text,
  StyleSheet,
  ListView,
  TouchableHighlight,
  InteractionManager,
  RefreshControl
} from 'react-native';

class Clients extends React.Component {
  constructor(props) {
    super(props);
    this.loadClients = this.loadClients.bind(this);
    this.rowData = this.rowData.bind(this);
    this.sectionHeader = this.sectionHeader.bind(this);
    this.state = { loading: true };
  }

  loadClients() {
    this.props.dispatch(fetchClients());
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.loadClients();
      this.setState({loading: false});
    });
  }

  selectClient(client) {
    this.props.dispatch(currentClient(client));
    this.props.dispatch(fetchDiets(client));

    let clientMenuTitle = client.email;
    if(client.firstName && client.surname)
      clientMenuTitle = `${client.firstName} ${client.surname}`

    Actions.ptClientMenu({ title: clientMenuTitle, client: client });
  }

  rowData(client) {
    if(client.length === 0) {
      return false;
    }
    return(
      <TouchableHighlight
        onPress={() => this.selectClient(client)}
        style={{ backgroundColor: '#ffffff' }}>

        <View style={styles.listRow}>
          <Text style={styles.rowName}>{client.firstName} {client.surname}</Text>
          <Text style={styles.rowUsername}>{client.email}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  sectionHeader() {
    return <Text style={styles.listTitle}>YOUR CLIENTS</Text>
  }

  render() {
    let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    dataSource = dataSource.cloneWithRows(this.props.clients.clients || []);

    return (
      <View style={styles.container}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this.loadClients} />
          }
          style={styles.clientList}
          dataSource={dataSource}
          renderHeader={this.sectionHeader}
          renderRow={this.rowData}
          enableEmptySections={true} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: '#f1f1f1',
  },
  listTitle: {
    color: '#8f8f8f',
    marginLeft: 6,
    paddingBottom: 5,
    fontWeight: '500',
    fontSize: 14,
  },
  clientList: {
    paddingTop: 20,
    borderWidth: 1,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomColor: '#bebcbc',
    height: height - 113,
  },
  listRow: {
    paddingLeft: 7,
    paddingBottom: 7,
    paddingTop: 7,
    borderWidth: 0.5,
    borderTopColor: '#e9e9e9',
    borderLeftColor: '#ffffff',
    borderRightColor: '#ffffff',
    borderBottomColor: '#bebcbc',
    backgroundColor: '#ffffff',
  },
  rowUsername: {
    color: '#747474',
    fontSize: 10,
  }
});

function mapStateToProps(state) {
  return {
    clients: state.clients
  }
}

module.exports = connect(mapStateToProps)(Clients);
