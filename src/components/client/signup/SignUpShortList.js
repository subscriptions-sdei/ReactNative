// @flow

var React = require('react');
import { connect } from 'react-redux';
import { fetchFoods, fetchShortListedFoods, shortListFood, removeFoodFromShortList } from 'reducers/foodSearch/foodSearchActions';
import { Actions } from 'react-native-router-flux';
import { reduxForm } from 'redux-form';
import { completeSignUp } from 'reducers/auth/AuthActions';
import moment from 'moment';

import {
  StyleSheet,
  View,
  Text,
  SegmentedControlIOS
} from 'react-native';

import ShortListSearch from 'components/client/shortlist/ShortListSearch';
import FavouriteFoods from 'components/client/shortlist/FavouriteFoods';

class SignUpShortList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedIndex: 0 };

    this.loadFoods = this.loadFoods.bind(this);
    this.loadShortList = this.loadShortList.bind(this);
    this.addFoodToShortList = this.addFoodToShortList.bind(this);
    this.removeFood = this.removeFood.bind(this);
    this.save = this.save.bind(this);
  }

  componentWillMount() {
    Actions.refresh({ rightTitle: 'Save', onRight: this.save });
  }

  save() {
    const { user, fields: { firstName, surname, gender, dateOfBirth, height, weight, meals, goal, activity } } = this.props;

    let genderName = (gender.value === 0) ? 'male' : 'female';
    let members = user.members || [user.email];
    if(!members.includes(user.email))
      members.push(user.email);

    let profile = {
      _id: user._id,
      email: user.email,
      firstName: firstName.value,
      surname: surname.value,
      dateOfBirth: dateOfBirth.value,
      gender: genderName,
      height: height.value,
      weight: parseFloat(weight.value),
      goal: goal.value,
      meals: meals.value,
      activity: activity.value,
      type: 'client',
      members: members
    }

    this.props.dispatch(completeSignUp(profile));
    Actions.clientDashboard();
  }

  loadFoods() {
    const user = this.props.user;
    this.props.dispatch(fetchShortListedFoods(user.email));
  }

  loadShortList() {
    this.loadFoods();
  }

  removeFood(foodId) {
    const user = this.props.user;
    this.props.dispatch(removeFoodFromShortList(foodId, user));
  }

  addFoodToShortList(foodId) {
    const user = this.props.user;
    this.props.dispatch(shortListFood(foodId, user));
  }

  render() {
    let components = {
      0: () => (
        <ShortListSearch
          foods={this.props.excludedFoods}
          loadFoods={this.loadFoods}
          shortListFood={(foodId) => this.addFoodToShortList(foodId)} />
      ),
      1: () => (
        <FavouriteFoods
          foods={this.props.shortListedFoods}
          loadFoods={this.loadShortList}
          removeFromShortList={(foodId) => this.removeFood(foodId)} />
      )
    }

    let component = components[this.state.selectedIndex]();

    return (
      <View style={styles.container}>
        <View style={styles.segmentContainer}>
          <SegmentedControlIOS
            values={['Search', 'Favourites']}
            tintColor="#22BCED"
            selectedIndex={this.state.selectedIndex}
            onChange={(event) => {
              this.setState({ selectedIndex: event.nativeEvent.selectedSegmentIndex });
            }} />
        </View>

        {component}
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    marginTop: 64,
  },
  segmentContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 6,
    borderBottomColor: '#BBBBBB',
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF'
  }
});

SignUpShortList = reduxForm({
  form: 'signup',
  fields: ['firstName', 'surname', 'gender', 'dateOfBirth', 'height', 'weight', 'meals', 'goal', 'activity'],
  destroyOnUnmount: false
}, (state) => {
  let { user, foods: { excludedFoods, shortListedFoods } } = state;
  return { user, excludedFoods, shortListedFoods };
})(SignUpShortList);

export default SignUpShortList;
