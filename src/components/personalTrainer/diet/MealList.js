// @flow

import React from 'react';
import Accordion from 'libs/Accordion';
import UpdateMeal from 'components/personalTrainer/diet/UpdateMeal';
import Swipeout from 'libs/Swipeout';

import {
  StyleSheet,
  View,
  Text,
  ListView,
  Alert
} from 'react-native';

class MealList extends React.Component {
  constructor(props) {
    super(props);
    this.sectionHeader = this.sectionHeader.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  sectionHeader(sectionData, sectionID) {
    let addMacros = (previous, current) => { return (parseFloat(previous) + parseFloat(current)).toFixed(1) }
    let { currentClient } = this.props;

    let totals = sectionData.reduce((previous, current) => {
      return {
        calories: addMacros(previous.calories, current.calories),
        protein: addMacros(previous.protein, current.protein),
        carbs: addMacros(previous.carbs, current.carbs),
        fat: addMacros(previous.fat, current.fat),
        quantity: addMacros(previous.quantity, current.quantity),
      }
    });

    let prepostLabel = '';
    const mealno = parseInt(this.props.meal);
    prepostLabel = mealno === currentClient.preWorkoutMeal ? ' (Preworkout)' : mealno === currentClient.postWorkoutMeal ? ' (Postworkout)' : '';

    return (
      <View style={styles.sectionHeader}>
        <Text style={{flex: 0.3, color: '#000000', fontWeight: 'bold'}}>Meal {this.props.meal}<Text style={{fontSize:10}}>{prepostLabel}</Text></Text>

        <View style={{flex: 0.6, flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text style={{flex: 0.2, color: '#000000', fontWeight: 'bold'}}>{totals.calories}</Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text style={{flex: 0.2, color: '#000000', fontWeight: 'bold'}}>{totals.protein}</Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text style={{flex: 0.2, color: '#000000', fontWeight: 'bold'}}>{totals.carbs}</Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text style={{flex: 0.2, color: '#000000', fontWeight: 'bold'}}>{totals.fat}</Text>
          </View>
        </View>
      </View>
    )
  }

  renderRow(mealFood, sectionID, rowID, highlightRow) {
    let serving = null;
    const food = this.props.foods.find(f => f._id === mealFood.foodId)

    if(mealFood.serving === 'g') {
      serving = <Text style={styles.serving}>{mealFood.quantity}g</Text>;
    } else {
      serving = <Text style={styles.serving}>{mealFood.quantity} x {mealFood.serving}</Text>;
    }

    let swipeoutBtns = [
      {
        text: "Delete",
        backgroundColor: "#DB3535",
        onPress: () => { this.props.deleteFromMeal(this.props.meal, mealFood) }
      }
    ]

    let header = (
      <View style={{flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 5, paddingVertical: 8}}>
        <View style={{flex: 0.3, flexDirection: 'column'}}>
          <Text style={{justifyContent: 'center', marginBottom: 2, fontSize: 12}}>{mealFood.name}</Text>
          {serving}
        </View>

        <View style={{flexDirection: 'row', flex: 0.6, alignItems: 'center'}}>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text>{mealFood.calories}</Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text>{mealFood.protein}</Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text>{mealFood.carbs}</Text>
          </View>
          <View style={{flex: 0.2, alignItems: 'center'}}>
            <Text>{mealFood.fat}</Text>
          </View>
        </View>
      </View>
    );

    let content = <UpdateMeal
                    meal={mealFood}
                    mealNo={this.props.meal}
                    food={food}
                    onPress={ this.props.updateMeal}/>

    return (
      <Swipeout right={swipeoutBtns}>
        <Accordion
           onPress={(data)=> { this.props.toggleAccordion(data) }}
           header={header}
           content={content}
           easing="easeOutCubic" />
      </Swipeout>
    )
  }

  render() {
    let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    dataSource = dataSource.cloneWithRows(this.props.meals);

    let seperator = (sectionID, rowID) => (
      <View
        key={`${sectionID}-${rowID}`}
        style={{borderBottomColor: '#B3B3B3', borderBottomWidth: 0.5}} />
    )

    return (
      <ListView
        style={styles.listView}
        keyboardShouldPersistTaps="always"
        dataSource={dataSource}
        scrollEnabled={false}
        renderSectionHeader={this.sectionHeader}
        renderRow={this.renderRow}
        renderScrollComponent={props => <View {...props} />}
        renderSeparator={seperator} />
    )
  }
}

let styles = StyleSheet.create({
  listView: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    backgroundColor: '#E4E2E2',
    padding: 5,
    paddingVertical: 10
  },
  serving: {
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#908F8F',
    marginLeft: 2
  }
});

module.exports = MealList;
