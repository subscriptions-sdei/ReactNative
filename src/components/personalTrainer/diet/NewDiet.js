// @flow

import React from 'react';
import { connect } from 'react-redux';
import { newDiet } from "actions/DietActions";
import { CalorieStrategy, calculateMacros } from 'libs/calorieCalculator';
import TableRow from 'components/TableRow';
import InputModal from 'components/InputModal';
import NumberInput from 'components/inputs/NumberInput';
import SelectInput from 'components/inputs/SelectInput';
import ErrorPanel from 'components/inputs/ErrorPanel';
import { Section, TableView } from 'react-native-tableview-simple'
import { reduxForm } from 'redux-form';
import OptionInput from 'components/inputs/OptionInput';
import Button from 'react-native-button';
import moment from 'moment';
import validate from 'validate.js';

import {
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
} from 'react-native';

const goalOptions = [
  { value: 0, title: "Increase Muscle Mass" },
  { value: 1, title: "Reduce Body Fat" },
  { value: 2, title: "Maintain Weight" }
];

const activityOptions = [
  { value: 0, title: "Sedentary" },
  { value: 1, title: "Light Activity" },
  { value: 2, title: "Active" },
  { value: 3, title: "Very Active" },
  { value: 4, title: "Extremely Active"},
];

const mealOptions = [
  { value: 3, title: "3" },
  { value: 4, title: "4"},
  { value: 5, title: "5"},
  { value: 6, title: "6"}
];

class NewDiet extends React.Component {
  constructor(props) {
    super(props);

    this.weightOnChange = this.weightOnChange.bind(this);
    this.goalOnChange = this.goalOnChange.bind(this);
    this.activityOnChange = this.activityOnChange.bind(this);
    this.mealsOnChange = this.mealsOnChange.bind(this);
    this.calculateCalories = this.calculateCalories.bind(this);
    this.caloriesOnChange = this.caloriesOnChange.bind(this);
    this.calculateMacros = this.calculateMacros.bind(this);
    this.submit = this.submit.bind(this);

    this.state = { errors: [] };
  }

  componentDidMount() {
    let { gender } = this.props;
    this.calorieCalc = new CalorieStrategy(gender);

    this.calculateCalories();
  }

  calculateCalories() {
    let {
      gender,
      dateOfBirth,
      height,
      fields: { goal, activity, weight, calories }
    } = this.props;

    const dob = moment(dateOfBirth, 'YYYY-MM-DD');
    const age = moment().diff(moment(dob), 'years');

    const cal = this.calorieCalc.calculateCalories({
      weight: weight.value,
      height: height,
      age: age,
      activity: activity.value,
      goal: goal.value
    }) || '';

    calories.onChange(cal.toString());

    if(goal.value.toString() && activity.value.toString())
      this.calculateMacros(this.calorieCalc.calories);
  }

  validateNewDiet(diet, macros) {
    attributes = {
      weight: diet.weight,
      goal: diet.goal,
      activity: diet.activity,
      calories: Object.keys(diet.calories)[0],
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat,
      meals: macros.meals,
    };

    let constraints = {
      weight: { presence: true },
      goal: { presence: true },
      activity: { presence: true },
      calories: { presence: true },
      protein: { presence: true },
      carbs: { presence: true },
      fat: { presence: true },
      meals: { presence: true },
    };

    return validate(attributes, constraints);
  }

  goalOnChange(val) {
    this.setState({ goalsOpen: false });
    this.props.fields.goal.onChange(val);
  }

  activityOnChange(val) {
    this.setState({ activitiesOpen: false });
    this.props.fields.activity.onChange(val);
  }

  calculateMacros(cal) {
    const { weight, calories, protein, fat, carbs } = this.props.fields;
    const macros = calculateMacros(weight.value, cal);

    protein.onChange(macros.protein);
    fat.onChange(macros.fat);
    carbs.onChange(macros.carbs);
  }

  weightOnChange(val) {
    const { weight } = this.props.fields;
    weight.onChange(val);
  }

  caloriesOnChange(val) {
    const { calories } = this.props.fields;
    let cal = this.calorieCalc.calories;
    calories.onChange(val);
    this.calculateMacros(cal);
  }

  mealsOnChange(meal) {
    const meals = this.props.fields.meals;
    this.setState({mealsOpen: false});
    meals.onChange(meal);
  }

  submit() {
    this.setState({ errors: [] });

    let { fields: { goal, activity, weight, calories, protein, fat, carbs, meals } } = this.props;

    let goalOption = goalOptions.find((g) => g.value === goal.value);
    goalOption = goalOption ? goalOption.title : "";

    let activityOption = activityOptions.find((a) => a.value === activity.value);
    activityOption = activityOption ? activityOption.title : "";

    let result = {};
    result[calories.value] = {};

    const macros = {
      protein: protein.value,
      carbs: carbs.value,
      fat: fat.value,
      meals: meals.value,
    }

    result[calories.value].macros = macros;

    let diet = {
      weight: weight.value,
      goal: goalOption,
      activity: activityOption,
      calories: result,
      type: 'diet'
    };

    let validatedDiet = this.validateNewDiet(diet, macros);

    if(validatedDiet) {
      let keys = Object.keys(validatedDiet);
      let errors = [];

      keys.forEach((k) => {
        errors = [...errors, ...validatedDiet[k]];
      });

      this.setState({ errors: errors });
    } else {
      this.props.submit(diet);
    }
  }

  render() {
    const {
      fields: { weight, goal, activity, calories, protein, fat, carbs, meals },
      handleSubmit,
      submitting
    } = this.props

    let goalOption = goalOptions.find((g) => g.value === goal.value);
    goalOption = goalOption ? goalOption.title : '';

    let activityOption = activityOptions.find((a) => a.value === activity.value);
    activityOption = activityOption ? activityOption.title : '';

    return(
      <View style={{flex: 1}}>
        <ScrollView keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag">
          <KeyboardAvoidingView behavior="position">
            <TableView>
              <Section>
                <TableRow title="Weight (kg)">
                  <NumberInput value={weight.value.toString()} onChangeText={(v) => this.weightOnChange(v)} />
                </TableRow>

                <TableRow title="Goals" value={goalOption} onPress={() => this.setState({goalsOpen: true})} />

                <TableRow title="Activity Level" value={activityOption} onPress={() => this.setState({activitiesOpen: true})} />
              </Section>

              <Section>
                <TableRow title="Calories">
                  <NumberInput value={calories.value} onChangeText={(v) => this.caloriesOnChange(v)} />
                </TableRow>
              </Section>

              <Section>
                <TableRow title="Protein">
                  <NumberInput value={protein.value} onChangeText={(v) => protein.onChange(v)} />
                </TableRow>

                <TableRow title="Fat">
                  <NumberInput value={fat.value} onChangeText={(v) => fat.onChange(v)} />
                </TableRow>

                <TableRow title="Carbs">
                  <NumberInput value={carbs.value} onChangeText={(v) => carbs.onChange(v)} />
                </TableRow>

                <TableRow
                  onPress={() => this.setState({mealsOpen: true})}
                  title="Meals"
                  description="No of meals incl snacks"
                  value={`${meals.value}`} />

              </Section>
            </TableView>

            <ErrorPanel errors={this.state.errors} />

            <View style={{flex: 1, alignItems: 'center', marginBottom: 20}}>
              <Button
                onPress={this.submit}
                style={{fontSize: 20, color: '#FFFFFF', backgroundColor: '#9ccb48', borderRadius: 4, width: 300, padding: 10}}>
                Save
              </Button>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>

        <InputModal
          title="Goals"
          onClosed={this.calculateCalories}
          open={this.state && this.state.goalsOpen}>
          <SelectInput list={goalOptions} onSelect={(val) => this.goalOnChange(val)} />
        </InputModal>

        <InputModal
          title="Activities"
          onClosed={this.calculateCalories}
          open={this.state && this.state.activitiesOpen}>
          <SelectInput list={activityOptions} onSelect={(val) => this.activityOnChange(val)} />
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

NewDiet = reduxForm({
  form: 'newDiet',
  fields: ['weight', 'goal', 'activity', 'calories', 'protein', 'fat', 'carbs', 'meals'],
}, (state) => {
  const currentClient = state.currentClient;
  const meals = currentClient.meals || 3;
  const { goal, activity } = currentClient;

  let selectedGoal = null;
  let selectedActivity = null;

  if(goal)
    selectedGoal = goalOptions.find((g) => g.title === goal).value;

  if(activity)
    selectedActivity = activityOptions.find((a) => a.title === activity).value;

  return {
    initialValues: {
      weight: currentClient.weight,
      meals: `${meals}`,
      goal: selectedGoal || '',
      activity: selectedActivity || ''
    }
  }
})(NewDiet);

export default NewDiet;
