// @flow

let React = require("react");
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';
let width = Dimensions.get('window').width;

import DietContainer from './DietContainer';
import More from 'containers/client/More';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

class Menu extends React.Component{
  renderTab() {
    switch(this.props.name) {
      case 'clientDiet':
        return <DietContainer />
      case 'clientMore':
          return <More {...this.props} />;
      default:
        return null;
    }
  }

  render() {
    return this.renderTab();
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    marginTop: 64,
  },
});

function mapStateToProps(state) {
  console.log("state.........", state);
  return {
    user: state.user
  }
}

module.exports = connect(mapStateToProps)(Menu);
