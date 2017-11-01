// @flow

import React from "react";
import { connect } from 'react-redux';

import { currentDiet, fetchDiets, deleteDiet, currentMacros } from "actions/DietActions";
import moment from "moment";
import { Actions } from 'react-native-router-flux';
import Dimensions from 'Dimensions';
let height = Dimensions.get('window').height;
import Swipeout from 'libs/Swipeout';

import {
  View,
  Text,
  ListView,
  TouchableHighlight,
  StyleSheet,
  InteractionManager,
  RefreshControl
} from 'react-native';

class DietHistory extends React.Component {
  constructor(props) {
    super(props);
    this.rowData = this.rowData.bind(this);
    this.delete = this.delete.bind(this);
    this.loadDiets = this.loadDiets.bind(this);
    this.state = {
      loading: true,
      dietsData : [],
    };
  }

  componentWillMount() {
    if(this.props.diet.diets.length === 0){
        Actions.refresh({ rightTitle: 'New Diet', onRight: () => Actions.newDiet() });
      }
    }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch(currentMacros());
      this.loadDiets();
      this.setState({loading: false});
    });
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.diet.diets){
      this.setState({ dietsData : nextProps.diet.diets })
    }
  }

  loadDiets() {
    this.props.dispatch(fetchDiets(this.props.currentClient));
  }

  selectDiet(diet) {
    this.props.dispatch(currentDiet(diet))
    Actions.mealPlan();
  }

  delete(diet) {
    this.props.dispatch(deleteDiet(diet, this.props.currentClient));
    Actions.refresh({ rightTitle: 'New Diet', onRight: () => Actions.newDiet() });
  }

  rowData(diet) {
    if(diet.length === 0) { return false; }

    let swipeoutBtns = [
      {
        text: "Delete",
        backgroundColor: "#DB3535",
        onPress: () => { this.delete(diet) }
      }
    ]

    return(
      <Swipeout right={swipeoutBtns}>
        <TouchableHighlight
          underlayColor="#E9E8E8"
          onPress={() => this.selectDiet(diet)}
          style={styles.listRow}>

          <View>
            <Text style={styles.rowUsername}>{diet.activity} </Text>
            <Text style={styles.rowDate}>{moment(diet.createdAt).format('Do MMMM YYYY  h:mm:ss a')}</Text>
          </View>
        </TouchableHighlight>
      </Swipeout>
    )
  }

  sectionHeader() {
    return(
      <Text style={styles.sectionHeader}>CLIENT DIETS</Text>
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }

    let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    dataSource = dataSource.cloneWithRows(this.state.dietsData || []);

    return (
      <View style={styles.container}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={() => this.loadDiets()} />
          }
          style={styles.refreshList}
          dataSource={dataSource}
          renderHeader={this.sectionHeader}
          renderRow={this.rowData}
          enableEmptySections={true}
          loadData={() => this.loadDiets()} />
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    marginTop: 64,
  },
  sectionHeader: {
    marginBottom: 10,
    marginLeft: 10,
    color: '#5E5E5E'
  },
  refreshList: {
    paddingTop: 10,
  },
  listRow: {
    padding: 5,
    backgroundColor: '#ffffff',
    borderColor: '#BFBFBF',
    borderBottomWidth: 0.5
  },
  rowDate: {
    marginTop: 4,
    color: '#5B5B5B',
    fontSize: 12
  }
});

function mapStateToProps(state) {
  let { diet, currentClient } = state;
  return {
    diet,
    currentClient,
  }
}

export default connect(mapStateToProps)(DietHistory)
