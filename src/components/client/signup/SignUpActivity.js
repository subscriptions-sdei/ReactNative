// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { reduxForm } from 'redux-form';
import OptionInput from 'components/inputs/OptionInput';
import AuthActions from 'reducers/auth/AuthActions';
import validate from 'validate.js';

import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native'

class SignUpActivity extends React.Component{
  constructor(props) {
    super(props);
    this.activityOnChange = this.activityOnChange.bind(this);
    this.nextScene = this.nextScene.bind(this);

    this.state = {
      selectedOption: '',
      selectedIndex: ''
    }
  }

  componentWillMount() {
    Actions.refresh({ rightTitle: 'next', onRight: this.nextScene });
  }

  nextScene() {
    let activity = { activity: this.props.fields.activity.value };
    let result = this.validateActivity(activity);

    if(result) {
      let keys = Object.keys(result);
      let errors = [];

      keys.forEach((k) => {
        errors = [...errors, ...result[k]];
      });

      this.setState({ errors: errors });
    } else {
        Actions.signupShortList();
    }
  }

  activityOnChange(val) {
    this.props.fields.activity.onChange(val);
  }

  validateActivity(attributes) {
    let constraints = {
      activity: { presence: true }
    };
    return validate(attributes, constraints);
  }

  render() {
    const options = [
      { title: 'Sedentary', description: "Little or no exercise" },
      { title: 'Light Activity', description: "Exercise 1-3 days/week" },
      { title: 'Active', description: "Exercise 3-5 days/week" },
      { title: 'Very Active', description: "Exercise 6-7 days/week" },
      { title: 'Extremely Active', description: "Exercise daily & physical job or exercise x2 a day" },
    ];

    const { fields: { activity } } = this.props;

    return (
      <View style={styles.container}>
        <OptionInput
          options={options}
          selectedOption={activity.value}
          onChange={this.activityOnChange} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: '#EFEFF4'
  },
  textStyle: {
    paddingTop: 5,
    paddingBottom: 5,
    color: 'black',
    flex: 1,
    fontSize: 14,
  }
});

SignUpActivity = reduxForm({
  form: 'signup',
  fields: ['activity'],
  destroyOnUnmount: false
})(SignUpActivity);

function mapStateToSignUp(state) {
  return { user: state.user };
}

export default connect(mapStateToSignUp)(SignUpActivity);
