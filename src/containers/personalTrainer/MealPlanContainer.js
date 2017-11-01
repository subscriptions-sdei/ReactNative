// @flow

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import FoodSearch from 'components/personalTrainer/diet/FoodSearch';
import DietSummary from 'components/personalTrainer/diet/DietSummary';
import InputModal from 'components/InputModal';
import Dimensions from 'Dimensions';
import CurrentGoalPanel from 'components/personalTrainer/diet/CurrentGoalPanel';
import { fetchDiets, currentMacros } from 'actions/DietActions'
import { calculateQuantity } from 'libs/calorieCalculator';
import { fetchFoods, fetchShortListedFoods, filterFoods, filterShortListFoods, searchFoods } from 'reducers/foodSearch/foodSearchActions';
import { Mealtypes } from 'helpers'
import { StyleSheet, View, SegmentedControlIOS, InteractionManager, PickerIOS, StatusBar } from 'react-native';

let PickerItemIOS = PickerIOS.Item;
let width = Dimensions.get('window').width;

class MealPlanContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
      mealTypeOpen: false,
      mealType: 'all',
      category: 'all',
      mealNo: 1
    };

    this.goalMacros = this.goalMacros.bind(this);
    this.loadFoods = this.loadFoods.bind(this);
    this.loadFavouriteFoods = this.loadFavouriteFoods.bind(this);
    this.openMealTypeModal = this.openMealTypeModal.bind(this);
    this.shortListFilter = this.shortListFilter.bind(this);
    this.foodFilter = this.foodFilter.bind(this);
    this.mealNo = this.mealNo.bind(this);
    this.searchFood = this.searchFood.bind(this);
  }

  componentWillMount() {
    let calories = this.props.diet.current.calories;
    this.props.dispatch(currentMacros(calories));

    let onBack = () => {
      Actions.pop();
      InteractionManager.runAfterInteractions(() => {
        this.props.dispatch(currentMacros());
        this.props.dispatch(fetchDiets(this.props.currentClient));
      });
    }

    Actions.refresh({ onBack: onBack });
  }

  loadFoods() {
    this.props.dispatch(fetchFoods());
  }

  loadFavouriteFoods() {
    const client = this.props.currentClient;
    this.props.dispatch(fetchShortListedFoods(client.email));
  }

  goalMacros() {
    let calories = this.props.diet.current.calories;
    let keys = Object.keys(calories);
    let macros = calories[keys[0]].macros;
    macros.calories = keys[0];

    return macros;
  }

  openModal(modal) {
    return this.state && this.state[modal];
  }

  openMealTypeModal() {
    this.setState({ mealTypeOpen: true });
  }

  setMealType(mealType) {
    this.setState({ mealType: mealType });
  }

  shortListFilter(category, mealtype) {
    const email = this.props.currentClient.email;
    this.setState({
      category: category,
      mealType: mealtype
    });

    this.props.dispatch(filterShortListFoods(email, category, mealtype));
  }

  foodFilter(category, mealtype) {
    this.setState({
      category: category,
      mealType: mealtype
    });
    this.props.dispatch(filterFoods(category, mealtype));
  }

  mealNo(no) {
    if (no) {
      this.setState({ mealNo: no });
    } else {
      return this.state.mealNo;
    }
  }

  searchFood(text, mealType, category) {
    this.props.dispatch(searchFoods(text, mealType, category));
  }

  render() {

    StatusBar.setBarStyle('light-content', true);

    let {
      foods: {
        foods,
        shortListedFoods
      },
      currentClient,
      dispatch,
      diet
    } = this.props;

    let components = {
      0: () => (
        <FoodSearch
          key="foodsearch"
          loadData={this.loadFoods}
          foods={foods}
          diet={diet}
          openMealTypeModal={this.openMealTypeModal}
          filterFoods={this.foodFilter}
          searchFood ={this.searchFood}
          mealType={this.state.mealType}
          category={this.state.category}
          mealNo={this.state.mealNo}
          dispatch={dispatch}
          currentClient={currentClient} />
      ),
      1: () => (
        <FoodSearch
          key="favourite"
          loadData={this.loadFavouriteFoods}
          foods={shortListedFoods}
          openMealTypeModal={this.openMealTypeModal}
          diet={diet}
          searchFood ={this.searchFood}
          filterFoods={this.shortListFilter}
          mealNo={this.state.mealNo}
          mealType={this.state.mealType}
          category={this.state.category}
          dispatch={dispatch}
          currentClient={currentClient}/>
      ),
      2: () => <DietSummary {...this.props} />
    }
    let component = components[this.state.selectedIndex]();

    var totalMeals = diet.current.calories[Object.keys(diet.current.calories)[0]].macros.meals

    return (
      <View style={styles.container}>
        <View style={styles.segmentContainer}>
          <SegmentedControlIOS
            values={['All Food', 'Client Shortlist', 'Meal Summary']}
            tintColor="#13C7C8"
            selectedIndex={this.state.selectedIndex}
            onChange={(event) => {
              this.setState({selectedIndex: event.nativeEvent.selectedSegmentIndex});
            }} />
        </View>

        {component}

        <CurrentGoalPanel goal={this.goalMacros()} mealNo={this.mealNo} totalMeals={totalMeals} current={this.props.currentMacros}/>

        <InputModal
          open={this.openModal('mealTypeOpen')}
          save={() => this.setState({mealTypeOpen: false})}
          close={() => this.setState({mealTypeOpen: false})}
          titleStyle={{backgroundColor:'#13C7C8'}}
          title="Meal Type Filter">
          <PickerIOS
            style={styles.picker}
            onValueChange={(type) => { this.setMealType(type) }}
            selectedValue={this.state.mealType}>
            {Object.keys(Mealtypes).map((key, index) => <PickerItemIOS key={key} value={Mealtypes[key].value} label={Mealtypes[key].label} />)}
          </PickerIOS>
        </InputModal>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f1f1',
    marginTop: 64,
    flex: 1
  },
  segmentContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {
      height: 2,
      width: 0
    },
    zIndex: 5
  },
  picker: {
    width: width
  }
});

function mapStateToProps(state) {
  let { user, diet, currentClient, foods } = state;
  let currentMacros = diet.currentMacros;

  return { user, diet, foods, currentClient, currentMacros };
}

module.exports = connect(mapStateToProps)(MealPlanContainer);
