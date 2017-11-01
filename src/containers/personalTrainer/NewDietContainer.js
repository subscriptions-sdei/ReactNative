// @flow

import React from 'react';
import { connect } from 'react-redux';
import { newDiet } from "actions/DietActions";

import NewDiet from 'components/personalTrainer/diet/NewDiet';

import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  TextInput
} from 'react-native';

class NewDietContainer extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit(diet) {
    diet.user = this.props.currentClient.email;
    const ptEmail = this.props.user._id.split(':')[1]
    diet.members = [this.props.currentClient.email, ptEmail];

    this.props.dispatch(newDiet(diet));
  }

  render() {
    const { gender, dateOfBirth, height } = this.props.currentClient;

    return(
      <View style={styles.container}>
        <NewDiet
          gender={gender}
          dateOfBirth={dateOfBirth}
          height={height}
          submit={this.submit} />
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    marginTop: 64
  },
});

function mapStateToProps(state) {
  let { user, diet, currentClient } = state;
  return {
    user,
    diet,
    currentClient,
  }
}

export default connect(mapStateToProps)(NewDietContainer);
