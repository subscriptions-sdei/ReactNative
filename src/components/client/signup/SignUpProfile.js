// @flow

import React from 'react';

import { reduxForm } from 'redux-form';
import { Section, TableView } from 'react-native-tableview-simple'
import Dimensions from 'Dimensions';
let width = Dimensions.get('window').width;

import TableRow from 'components/TableRow';
import InputModal from 'components/InputModal';
import ErrorPanel from 'components/inputs/ErrorPanel';
import DateInput from 'components/inputs/DateInput';
import HeightInput from 'components/inputs/HeightInput';
import WeightInput from 'components/inputs/WeightInput';
import SelectInput from 'components/inputs/SelectInput';
import { PrePostWorkoutInput } from 'components/inputs';

import { Actions } from 'react-native-router-flux';
import validate from 'validate.js';
import dismissKeyboard from 'dismissKeyboard'
import moment from 'moment';

import {
  View,
  Text,
  TextInput,
  SegmentedControlIOS,
  StyleSheet,
  DatePickerIOS,
} from 'react-native'

const mealOptions = [
  { value: 3, title: "3" },
  { value: 4, title: "4" },
  { value: 5, title: "5" },
  { value: 6, title: "6" }
];

class SignUpProfile extends React.Component {
  constructor(props) {
    super(props);
    this.nextScene = this.nextScene.bind(this);
    this.mealsOnChange = this.mealsOnChange.bind(this);
    this.state = { errors: [] };
  }

  componentWillMount() {
    Actions.refresh({ rightTitle: 'next', onRight: this.nextScene });
  }

  nextScene() {
    const { fields: { firstName, surname, gender, dateOfBirth, height, weight, meals, preWorkoutMeal, postWorkoutMeal } } = this.props;

    const profile = {
      firstName, surname, gender, dateOfBirth, height, weight, meals, preWorkoutMeal, postWorkoutMeal
    }

    let result = this.validateProfile(profile);

    if (result) {
      let keys = Object.keys(result);
      let errors = [];

      keys.forEach((k) => {
        errors = [...errors, ...result[k]];
      });

      this.setState({ errors: errors });
    } else {
      Actions.signupGoal();
    }
  }

  validateProfile(attributes) {
    attributes = {
      firstName: attributes.firstName.value,
      surname: attributes.surname.value,
      gender: attributes.gender.value,
      dateOfBirth: attributes.dateOfBirth.value,
      height: attributes.height.value,
      weight: attributes.weight.value,
      meals: attributes.meals.value,
      preWorkoutMeal: attributes.preWorkoutMeal.value, 
      postWorkoutMeal: attributes.postWorkoutMeal.value
    }

    let constraints = {
      firstName: { presence: true },
      surname: { presence: true },
      gender: { presence: true },
      dateOfBirth: { presence: true },
      height: { presence: true },
      weight: { presence: true },
      meals: { presence: true },
      preWorkoutMeal: { presence: true }, 
      postWorkoutMeal: { presence: true }
    };

    return validate(attributes, constraints);
  }

  renderRow(title, component) {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ justifyContent: 'center' }}>
          <Text style={{ fontSize: 16 }}>{title}</Text>
        </View>
        <View>
          {component}
        </View>
      </View>
    )
  }

  mealsOnChange(meal) {
    if (this.props.fields.meals.value !== meal) {
      this.props.fields.preWorkoutMeal.onChange(0);
      this.props.fields.postWorkoutMeal.onChange(1);
    }  
    let meals = this.props.fields.meals;
    this.setState({ mealsOpen: false });
    meals.onChange(meal);
  }

  getTowValue(pre: number, post: number) {
    let msg = '';

    if (pre && post) {
      msg = 'Between Meal ' + pre + ' and Meal ' + post
    }

    if (!pre && post) {
      msg = 'Before Meal ' + post
    }

    if (pre && !post) {
      msg = 'After Meal ' + pre
    }

    return msg;
  }

  getTowDesc(pre, post) {
    let msg = '';

     if (pre && post) {
      msg = 'Meal ' + pre + ' (Preworkout) Meal ' + post + ' (Postworkout)'
    }

    if (!pre && post) {
      msg = 'Meal ' + post + ' (Postworkout)'
    }

    if (pre && !post) {
      msg = 'Meal ' + pre + ' (Preworkout)'
    }

    return msg;
  }

  render() {
    const { fields: { firstName, surname, gender, dateOfBirth, height, weight, meals, preWorkoutMeal, postWorkoutMeal } } = this.props;

    let dob = '', tow = this.getTowValue(preWorkoutMeal.value, postWorkoutMeal.value),
      towDesc = this.getTowDesc(preWorkoutMeal.value, postWorkoutMeal.value);

    if (dateOfBirth.value)
      dob = moment(dateOfBirth.value).format('DD MMM YYYY');

    return (
      <View style={styles.container}>
        <TableView>
          <Section>
            <TableRow title="First Name">
              <TextInput
                style={{ flex: 1, fontSize: 14 }}
                value={firstName.value}
                autoCapitalize="none"
                editable={true}
                clearButtonMode="always"
                autoFocus={true}
                onChangeText={(v) => firstName.onChange(v)} />
            </TableRow>

            <TableRow title="Surname">
              <TextInput
                style={{ flex: 1, fontSize: 14 }}
                value={surname.value}
                autoCapitalize="none"
                editable={true}
                clearButtonMode="always"
                onChangeText={(v) => surname.onChange(v)} />
            </TableRow>

            <TableRow title="Gender">
              <SegmentedControlIOS
                style={{ width: 130 }}
                selectedIndex={0}
                onChange={(e) => {
                  dismissKeyboard();
                  gender.onChange(e.nativeEvent.selectedSegmentIndex);
                }}
                values={['Male', 'Female']} />
            </TableRow>

            <TableRow onPress={() => this.setState({ dobOpen: true })} title="Date of Birth" value={`${dob}`} />

            <TableRow onPress={() => this.setState({ heightOpen: true })} title="Height" value={`${height.value} cm`} />

            <TableRow onPress={() => this.setState({ weightOpen: true })} title="Weight" value={`${weight.value} kg`} />

            <TableRow
              onPress={() => this.setState({ mealsOpen: true })}
              title="Meals"
              description="No of meals incl snacks"
              value={`${meals.value}`} />

            <TableRow title="When do you workout" textStyle={{fontSize: 14, textAlign: 'center'}} description={towDesc} onPress={() => this.setState({towOpen: true})} value={tow} />

          </Section>
        </TableView>

        <ErrorPanel errors={this.state.errors} />

        <InputModal
          title="When do you workout"
          open={this.state && this.state.towOpen}
          value={{
            pre: preWorkoutMeal.value,
            post: postWorkoutMeal.value
          }}
          meals={meals}
          save={(value, status) => {
            preWorkoutMeal.onChange(value.pre);
            postWorkoutMeal.onChange(value.post);
            this.setState({towOpen: status})
          }}
          close={() => this.setState({towOpen: false})}
          type="timeWorkout"
        />

        <InputModal
          title="Date of Birth"
          open={this.state && this.state.dobOpen}
          value={dateOfBirth.value}
          save={(value, status) => {
            dateOfBirth.onChange(value)
            this.setState({ dobOpen: status })
          }
          }
          close={() => this.setState({ dobOpen: false })}
          type="date" />

        <InputModal
          title="Height"
          open={this.state && this.state.heightOpen}
          save={() => this.setState({ heightOpen: false })}
          close={() => this.setState({ heightOpen: false })}>

          <HeightInput
            selectedHeight={height.value}
            onChange={height.onChange} />
        </InputModal>

        <InputModal
          title="Weight"
          open={this.state && this.state.weightOpen}
          save={() => this.setState({ weightOpen: false })}
          close={() => this.setState({ weightOpen: false })}>

          <WeightInput
            selectedWeight={weight.value}
            onChange={weight.onChange} />
        </InputModal>

        <InputModal
          title="Number of Meals"
          open={this.state && this.state.mealsOpen}>
          <SelectInput list={mealOptions} onSelect={(val) => this.mealsOnChange(val)} />
        </InputModal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: '#EFEFF4',
  },
  picker: {
    width: width,
    paddingRight: 100,
    paddingLeft: 100,
  },
});

SignUpProfile = reduxForm({
  form: 'signup',
  fields: ['firstName', 'surname', 'gender', 'dateOfBirth', 'height', 'weight', 'meals', 'preWorkoutMeal', 'postWorkoutMeal'],
  destroyOnUnmount: false
}, (state) => {
  let user = state.user;
  return {
    initialValues: {
      firstName: user.firstName,
      surname: user.surname,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender || 0,
      height: user.height || '150',
      weight: user.weight || '60.0',
      preWorkoutMeal: 0, 
      postWorkoutMeal: 1,
      meals: 3
    }
  }
})(SignUpProfile);

export default SignUpProfile;
