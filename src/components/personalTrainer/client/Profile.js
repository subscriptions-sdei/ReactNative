// @flow

let React = require('react');

import {reduxForm} from 'redux-form';
import {Section, TableView} from 'react-native-tableview-simple'
import {updateUserProfile} from 'actions/CurrentClientActions';

import Button from 'react-native-button';
import TableRow from 'components/TableRow';
import InputModal from 'components/InputModal';
import ErrorPanel from 'components/inputs/ErrorPanel';
import WeightInput from 'components/inputs/WeightInput';
import SelectInput from 'components/inputs/SelectInput';

import validate from 'validate.js';
import dismissKeyboard from 'dismissKeyboard'
import moment from 'moment';

import {
  View,
  Text,
  TextInput,
  SegmentedControlIOS,
} from 'react-native'

const mealOptions = [
  {value: 3, title: "3"},
  {value: 4, title: "4"},
  {value: 5, title: "5"},
  {value: 6, title: "6"}
];

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.mealsOnChange = this.mealsOnChange.bind(this);
    this.state = {errors: []};
  }

  submit() {
    const {fields: {firstName, surname, gender, dateOfBirth, height, weight, meals, preWorkoutMeal, postWorkoutMeal}, currentClient} = this.props;
    const genderVal = (gender.value === 0) ? 'male' : 'female';

    const profile = Object.assign({},
      currentClient, {
        firstName: firstName.value,
        surname: surname.value,
        gender: genderVal,
        dateOfBirth: dateOfBirth.value,
        height: height.value,
        weight: weight.value,
        meals: meals.value,
        preWorkoutMeal: preWorkoutMeal.value,
        postWorkoutMeal: postWorkoutMeal.value
      });

    let result = this.validateProfile(profile);

    if (result) {
      let keys = Object.keys(result);
      let errors = [];

      keys.forEach((k) => {
        errors = [...errors, ...result[k]];
      });

      this.setState({errors: errors});
    } else {
      this.props.dispatch(updateUserProfile(profile));
    }
  }

  validateProfile(attributes) {
    let constraints = {
      firstName: {presence: true},
      surname: {presence: true},
      gender: {presence: true},
      dateOfBirth: {presence: true},
      height: {presence: true},
      weight: {presence: true},
      meals: {presence: true},
      preWorkoutMeal: {presence: true},
      postWorkoutMeal: {presence: true}
    };

    return validate(attributes, constraints);
  }

  renderRow(title, component) {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{justifyContent: 'center'}}>
          <Text style={{fontSize: 16}}>{title}</Text>
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
    this.setState({mealsOpen: false});
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

  getTowDesc(pre: number, post: number) {
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
    const {fields: {firstName, surname, gender, dateOfBirth, height, weight, meals, preWorkoutMeal, postWorkoutMeal}} = this.props;
    let dob = '', tow = this.getTowValue(preWorkoutMeal.value, postWorkoutMeal.value),
    towDesc = this.getTowDesc(preWorkoutMeal.value, postWorkoutMeal.value);

    if (dateOfBirth.value)
      dob = moment(dateOfBirth.value, 'YYYY-MM-DD').format('DD MMM YYYY');

    return (
      <View style={styles.container}>
        <TableView>
          <Section>
            <TableRow title="First Name">
              <TextInput
                style={{flex: 1, fontSize: 14}}
                value={firstName.value}
                autoCapitalize="none"
                editable={true}
                clearButtonMode="always"
                onChangeText={(v) => firstName.onChange(v)}/>
            </TableRow>

            <TableRow title="Surname">
              <TextInput
                style={{flex: 1, fontSize: 14}}
                value={surname.value}
                autoCapitalize="none"
                editable={true}
                clearButtonMode="always"
                onChangeText={(v) => surname.onChange(v)}/>
            </TableRow>
            <TableRow title="Gender">
              <SegmentedControlIOS
                style={{width: 130}}
                selectedIndex={gender.value}
                onChange={(e) => {
                  dismissKeyboard();
                  gender.onChange(e.nativeEvent.selectedSegmentIndex);
                }}
                values={['Male', 'Female']}/>
            </TableRow>

            <TableRow onPress={() => this.setState({dobOpen: true})} title="Date of Birth" value={dob}/>

            <TableRow onPress={() => this.setState({heightOpen: true})} title="Height" value={`${height.value} cm`}/>

            <TableRow onPress={() => this.setState({weightOpen: true})} title="Weight" value={`${weight.value} kg`}/>

            <TableRow
              onPress={() => this.setState({mealsOpen: true})}
              title="Meals"
              description="No of meals incl snacks"
              value={`${meals.value}`}/>

            <TableRow textStyle={{fontSize: 14, textAlign: 'center'}} description={towDesc} title="When do you workout" onPress={() => this.setState({towOpen: true})} value={tow} />

          </Section>
        </TableView>

        <ErrorPanel errors={this.state.errors}/>

        <Button
          onPress={this.submit}
          style={styles.submitButton}>
          Update
        </Button>

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
          type="timeWorkout" />

        <InputModal
          title="Date of Birth"
          open={this.state && this.state.dobOpen}
          value={dateOfBirth}
          save={(value, status) => {
            dateOfBirth.onChange(value);
            this.setState({dobOpen: status})
          }}
          close={() => this.setState({dobOpen: false})}
          type="date" />

        <InputModal
          title="Height"
          open={this.state && this.state.heightOpen}
          save={(value, status) => {
            height.onChange(value);
            this.setState({heightOpen: status})
          }}
          selected={height}
          close={() => this.setState({heightOpen: false})}
          type="height">
        </InputModal>

        <InputModal
          title="Weight"
          open={this.state && this.state.weightOpen}
          save={() => this.setState({weightOpen: false})}
          close={() => this.setState({weightOpen: false})}>

          <WeightInput
            selectedWeight={weight.value}
            onChange={weight.onChange}/>
        </InputModal>

        <InputModal
          title="Number of Meals"
          open={this.state && this.state.mealsOpen}>
          <SelectInput list={mealOptions} onSelect={(val) => this.mealsOnChange(val)}/>
        </InputModal>
      </View>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: '#EFEFF4',
  },
  submitButton: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    fontSize: 20,
    color: '#9ccb48',
    fontWeight: 'normal',
    padding: 15
  }
};

Profile = reduxForm({
  form: 'profile',
  fields: ['firstName', 'surname', 'gender', 'dateOfBirth', 'height', 'weight', 'meals', 'preWorkoutMeal', 'postWorkoutMeal'],
}, (state) => {
  let currentClient = state.currentClient;
  let gender = (currentClient.gender === 'male') ? 0 : 1;

  const isEmptyOrUndefined = (v) => {
    return v === '' || typeof v === 'undefined';
  }

  return {
    currentClient,
    initialValues: {
      firstName: currentClient.firstName,
      surname: currentClient.surname,
      dateOfBirth: currentClient.dateOfBirth,
      gender: gender,
      height: currentClient.height || '150',
      weight: currentClient.weight || '60.0',
      meals: currentClient.meals || 3,
      preWorkoutMeal: isEmptyOrUndefined(currentClient.preWorkoutMeal) ? 0 : currentClient.preWorkoutMeal,
      postWorkoutMeal: isEmptyOrUndefined(currentClient.postWorkoutMeal) ? 1 : currentClient.postWorkoutMeal
    }
  }
})(Profile);

export default Profile;
