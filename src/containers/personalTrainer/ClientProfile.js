// @flow

import React from 'react';
import { connect } from 'react-redux';

import Profile from 'components/personalTrainer/client/Profile';

class ClientProfile extends React.Component{
  render() {
    return <Profile {...this.props}  />
  }
}

let styles = {
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    marginTop: 64,
  },
};

function mapStateToProps(state) {
  let { currentClient: { dateOfBirth, email, firstName, gender, height, surname, type, weight, preWorkoutMeal, postWorkoutMeal} } = state;

  return {
    dateOfBirth,
    email,
    firstName,
    gender,
    height,
    surname,
    type,
    weight,
    preWorkoutMeal,
    postWorkoutMeal
  };
}

export default connect(mapStateToProps)(ClientProfile)
