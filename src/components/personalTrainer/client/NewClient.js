// @flow

let React = require('react');
import { connect } from 'react-redux';

import {
  View,
  Text,
  TextInput,
  SegmentedControlIOS,
  StyleSheet,
} from 'react-native';

import { Section, TableView } from 'react-native-tableview-simple'
import { Actions } from 'react-native-router-flux';

import TableRow from 'components/TableRow';
import InputModal from 'components/InputModal';
import ErrorPanel from 'components/inputs/ErrorPanel';
import Button from 'react-native-button';
let validate = require("validate.js");
import moment from 'moment';

import { associatePersonalTrainer, clear } from 'reducers/newClient/NewClientActions';

import DateInput from 'components/inputs/DateInput';
import HeightInput from 'components/inputs/HeightInput';
import WeightInput from 'components/inputs/WeightInput';

class NewClient extends React.Component{
  constructor(props) {
    super(props);

    this.emailOnChange = this.emailOnChange.bind(this);
    this.validateUser = this.validateUser.bind(this);
    this.submit = this.submit.bind(this);

    this.state = { email: '', gender: 'male' };
  }

  componentWillMount() {
    let back = () => {
      this.props.dispatch(clear());
      Actions.pop();
    }
    Actions.refresh({ onBack: back });
  }

  emailOnChange(email) {
    this.setState({ email: email });
  }

  validateUser(userAttributes = {}) {
    let constraints = {
      email: {
        presence: true,
        email: { message: `${userAttributes.email} is not a valid email` }
      }
    };

    return validate(userAttributes, constraints);
  }

  submit() {
    let createNewClient = this.props.createNewClient;

    let userAttributes = {
      email: this.state.email.toLowerCase()
    }

    let result = this.validateUser(userAttributes);

    if(result) {
      let keys = Object.keys(result);
      let errors = [];

      keys.forEach((k) => {
        errors = [...errors, ...result[k]];
      });

      this.setState({ errors: errors });
    } else {
      this.setState({ errors: null });

      let clientEmail = this.state.email;
      let ptEmail = this.props.user.email;

      this.props.dispatch(associatePersonalTrainer(clientEmail, ptEmail));
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <TableView>
          <Section>
            <TableRow title="Email">
              <TextInput
                style={{flex: 1, fontSize: 14}}
                value={this.state.email}
                autoCorrect={true}
                autoCapitalize="none"
                editable={true}
                clearButtonMode="always"
                autoFocus={true}
                keyboardType="email-address"
                onChangeText={this.emailOnChange} />
            </TableRow>
          </Section>

          <ErrorPanel errors={this.state.errors || this.props.errors} />

          <View style={{alignItems: 'center'}}>
            <Button
              onPress={this.submit}
              style={styles.submitButton}>
              Save
            </Button>
          </View>
        </TableView>
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
  submitButton: {
    backgroundColor: '#9ccb48',
    borderRadius: 4,
    fontSize: 20,
    color: '#FFFFFF',
    width: 300,
    padding: 10
  }
});

function mapStateToProps(state) {
  let { errors } = state.newClient;

  return {
    user: state.user,
    errors: errors
  };
}

module.exports = connect(mapStateToProps)(NewClient);
