// @flow

import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  ListView,
  InteractionManager,
  RecyclerViewBackedScrollView,
  RefreshControl,
  KeyboardAvoidingView,
  TextInput
} from 'react-native';

// UI Components
import AccordionInput from 'components/personalTrainer/diet/AccordionInput';

// -- Customized
import AccordionMacros from './AccordionMacros';
import FoodSearchRow from './Row';
import FoodFilter from './Filter';

// Actions
import {currentDiet, updateDiet, currentMacros} from 'actions/DietActions';

import dismissKeyboard from 'dismissKeyboard'
import Dimensions from 'Dimensions';
const height = Dimensions.get('window').height;

class FoodSearch extends React.Component {
  constructor(props) {
    super(props);
    this.rowData = this.rowData.bind(this);
    this.addFoodToMeal = this.addFoodToMeal.bind(this);
    this.loadData = this.loadData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);

    const diet = props.diet.current;
    const calories = Object.keys(diet.calories);
    const macros = diet.calories[calories[0]].macros;

    this.state = {
      meals: macros.meals,
      loading: true,
      searchText: undefined
    }
  }

  componentWillMount() {
    this.loadData();
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({loading: false});
    });
  }

  updateFilter(category, mealtype) {
    this.props.filterFoods(category, mealtype);
  }

  searchFoods(text) {
    this.setState({searchText: text });
    this.props.searchFood(text, this.props.mealType, this.props.category);
  }

  loadData() {
    this.props.loadData();
  }

  addFoodToMeal(food, mealkey) {
    let diet = this.props.diet.current;
    const calories = Object.keys(diet.calories);
    const meals = diet.calories[calories[0]].meals;
    const foods = this.props.foods;

    let cal = diet.calories[calories[0]];
    const findFood = foods.find(f => f._id === food.foodId);

    if (meals && typeof mealkey !== 'undefined' &&
        typeof meals[mealkey] !== 'undefined') {
      let findMeal = meals[mealkey].find((meal) => {
        return meal.foodId === food.foodId
      })

      if (typeof findMeal !== 'undefined') {
        return false;
      }
    }

    const viewAsGrams = food.serving.name === 'g';

    let mealFood = {
      foodId: food.foodId,
      name: findFood.name,
      grams: food.grams,
      quantity: food.quantity,
      serving: food.serving.name,
      calories: food.calories,
      protein: food.protein,
      fat: food.fat,
      carbs: food.carbs,
      viewAsGrams: viewAsGrams
    }

    if (cal.meals === undefined) {
      cal.meals = {};
    }

    if (cal.meals[food.meal] === undefined) {
      cal.meals[food.meal] = [];
    }

    cal.meals[food.meal].push(mealFood);
    diet.calories[calories[0]] = cal;

    this.props.dispatch(updateDiet(diet, this.props.currentClient));
    this.props.dispatch(currentMacros(diet.calories));

    return true;
  }

  rowData(food) {
    let accordionContent = (self) => {
       if(self.state.isVisible) {
         const selectedItemIndex = this.props.foods.indexOf(food);
         this.refs.list.scrollTo({x:0, y:( selectedItemIndex * 75), animated: true});
       }
      return (
        <AccordionInput
            food={food}
            meals={this.state.meals}
            mealNo={this.props.mealNo}
            selected={self.state.isVisible}
            setMacros={self.setMacros}
            addFoodToMeal={(food, mealkey) => this.addFoodToMeal(food, mealkey)}
          />
      )
    }

    let accordionHead = (self) => {
      return (
        <FoodSearchRow
          searchText={this.state.searchText}
          macros={self.state.macros}
          food={food}
          selected={self.state.isVisible} />
      )
    }

    return (
      <AccordionMacros
        style={{overflow: 'scroll'}}
        underlayColor={'#E7E4E4'}
        header={accordionHead}
        content={accordionContent}
        food={food}
        onPress={(self) => {
          dismissKeyboard();
          if (!self.state.isVisible) {
            this.close && this.close();
            this.close = self.close;
          }
        }}
        easing="easeOutCubic"/>
    );
  }


  render() {
    if (this.state.loading) {
      return (
        <View style={{flex: 1}}>
          <Text>Loading...</Text>
        </View>
      );
    }

    let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    dataSource = dataSource.cloneWithRows(this.props.foods || []);

    return (
      <KeyboardAvoidingView style={styles.container} behavior="position" keyboardVerticalOffset={65}>
        <TextInput
            style={styles.searchInput}
            onChangeText={(text) => this.searchFoods(text)}
            clearButtonMode="always"
            placeholder={'Search'} />
        <ListView
          ref="list"
          refreshControl={<RefreshControl refreshing = {this.state.loading} onRefresh = {this.loadData} />}
          dataSource={dataSource}
          stickyHeaderIndices={[]}
          renderScrollComponent={(props) => <RecyclerViewBackedScrollView {...props}/>}
          keyboardShouldPersistTaps="always"
          style={styles.refreshList}
          renderHeader={(props) =>
            <FoodFilter updateFilter={this.updateFilter} openMealTypeModal={this.props.openMealTypeModal} mealType={this.props.mealType} category={this.props.category} />}
          pageSize={10}
          renderRow={this.rowData}
          viewIsInsideTabBar={true}
          enableEmptySections={true}/>
      </KeyboardAvoidingView>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    height: height - 260
  },
  refreshList: {
    paddingTop: 15,
    backgroundColor: 'white'
  },
  selectedIcon: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: '#2fbced'
  },
  tabIcon: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: '#eaeaea',
    height: 40
  },
  tabText: {
    color: '#737373',
    fontWeight: 'bold'
  },
  sectionHeader: {
    marginBottom: 10,
    marginLeft: 5,
    color: '#5E5E5E'
  },
  listRow: {
    padding: 6,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden'
  },
  listDetail: {
    flex: 2,
    alignSelf: 'center',
    paddingRight: 15
  },
  listImage: {
    flex: 0,
    width: 55,
    height: 55,
    overflow: 'hidden',
    borderRadius: 100,
    padding: 0,
    borderColor: '#ccc',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  image: {
    height: 56,
    width: 56,
    alignSelf: 'center'
  },
  dropdown: {
    width: 300,
    borderColor: '#999',
    borderWidth: 1,
    padding: 5,
    transform: [{'translate': [0, 0, 1]}
    ]
  },
  dropdownOptions: {
    marginTop: 30,
    borderColor: '#ccc',
    borderWidth: 2,
    width: 300,
    height: 200,
    transform: [{'translate': [0, 0, 1]}]
  },
  searchInput: {
    height: 40,
    padding: 10,
    borderColor: '#f1f1f1',
    borderWidth: 1,
    margin:8,
    backgroundColor: 'white'
  }
});

module.exports = FoodSearch;
