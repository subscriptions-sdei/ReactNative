// @flow

import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Actions } from 'react-native-router-flux';
import ErrorPanel from 'components/inputs/ErrorPanel';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native'

import OptionInput from 'components/inputs/OptionInput';
import validate from 'validate.js';

class SignUpGoal extends React.Component {
  constructor(props) {
    super(props);
    this.goalOnChange = this.goalOnChange.bind(this);
    this.nextScene = this.nextScene.bind(this);
    this.state = { errors: [] };
  }

  componentWillMount() {
    Actions.refresh({ rightTitle: 'next', onRight: this.nextScene });
  }

  validateGoal(attributes) {
    let constraints = {
      goal: { presence: true }
    };

    return validate(attributes, constraints);
  }

  nextScene() {
    let goal = { goal: this.props.fields.goal.value };

    let result = this.validateGoal(goal);

    if(result) {
      let keys = Object.keys(result);
      let errors = [];

      keys.forEach((k) => {
        errors = [...errors, ...result[k]];
      });

      this.setState({ errors: errors });
    } else {
      Actions.signupActivity();
    }
  }

  goalOnChange(val) {
    this.props.fields.goal.onChange(val);
  }

  render() {
    const { fields: { goal } } = this.props;

    const options = [
      { title: "Increase Muscle Mass" },
      { title: "Reduce Body Fat" },
      { title: "Maintain Weight" }
    ];

    return (
      <View style={styles.container}>
        <OptionInput
          header="What is your goal?"
          selectedOption={goal.value}
          options={options}
          onChange={this.goalOnChange} />

        <ErrorPanel errors={this.state.errors} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: '#EFEFF4'
  }
});

function mapStateToSignUp(state) {
  return { user: state.user };
}

SignUpGoal = reduxForm({
  form: 'signup',
  fields: ['goal'],
  destroyOnUnmount: false
})(SignUpGoal);

export default connect(mapStateToSignUp)(SignUpGoal);
