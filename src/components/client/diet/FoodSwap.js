// @flow

import React, { Component } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import { calculateCalories } from 'libs/calorieCalculator';
import Accordion from 'libs/Accordion';
import Button from 'react-native-button';
import { percentageToServingSize } from 'libs/foodSwapConverter'

import {
  View,
  Text,
  Image
} from "react-native";

export default class FoodSwap extends React.Component {
  constructor(props) {
    super(props);
    this.convertFood = this.convertFood.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  calculate(calories: number, substitute: any) {
    return calculateCalories(calories, 100, substitute);
  }

  calculateWeight(selectedFood, substitute) {
    return this.calculate(selectedFood.calories, substitute).grams;
  }

  convertFood(mealNo, substitute, selectedFood, viewAsGrams) {
    let macros = this.calculate(selectedFood.calories, substitute);
    this.props.convertFood(mealNo, substitute, selectedFood, macros, viewAsGrams);
  }

  resizeFoodName = (name: string, length: number = 25) => {
    if(name.length >= length)
      return `${name.slice(0, length)}...`;

    return name;
  };

  renderHeader(substitute, grams) {
    let { mealNo, convertFood } = this.props;

    return (
      <View style={styles.substituteRow}>
        <View style={{ flex: 0.8, flexDirection: 'row'}}>
          <Icon name="exchange" size={18} style={{marginRight: 15, paddingTop: 5}} color='#F49914' />
          {this.renderImage(substitute.image)}
          <Text style={styles.substituteText}>{this.resizeFoodName(substitute.name)}</Text>
        </View>
        <View style={{ flex: 0.2, alignItems: 'flex-end' }}>
          <Text style={{marginRight: 5, fontSize: 15, paddingTop: 5}}>{grams}</Text>
        </View>
      </View>
    )
  }

  renderContent(grams, servingSize, substitute) {
    let { mealNo, convertFood, selectedFood } = this.props;

    return (
      <View style={{flexDirection: 'row', backgroundColor: '#F0F0F0'}}>
        <View style={{flex: 0.5}}>
          <Button
            style={{color: '#FFFFFF', fontSize: 12}}
            containerStyle={{backgroundColor: '#1E95F7', marginLeft: 5, marginRight: 2, marginBottom: 15, marginTop: 15, padding: 5, borderRadius: 2}}
            onPress={() => this.convertFood(mealNo, substitute, selectedFood, true)}>
            {grams}
          </Button>
        </View>
        <View style={{flex: 0.5}}>
          <Button
            style={{color: '#FFFFFF', fontSize: 12}}
            containerStyle={{backgroundColor: '#1E95F7', marginLeft: 2, marginRight: 5, marginBottom: 15, marginTop: 15, padding: 5, borderRadius: 2}}
            onPress={() => this.convertFood(mealNo, substitute, selectedFood, false)}>
            {servingSize}
          </Button>
        </View>
      </View>
    )
  }

  renderImage(image) {
    if (image) {
      return (
        <View style={styles.listImage}>
          <Image
            style={styles.image}
            shouldRasterizeIOS={true}
            source={{ uri: image.replace('jpg', 'png') }} />
        </View>
      )
    }

    return <View style={[styles.listImage, { backgroundColor: '#DFDCDC' }]}></View>
  }

  renderRow(substitute, index) {
    let { selectedFood } = this.props;
    const weight = Math.round(this.calculateWeight(selectedFood, substitute));
    const grams = `${weight} g`;

    const substituteServingWeight = substitute.servings[0].grams;
    const percentage = (weight / substituteServingWeight) * 100;

    const servingSize = percentageToServingSize(percentage);
    const servingSizeText = this.resizeFoodName(`${servingSize} ${substitute.servingName}`, 21);

    return (
      <Accordion
        key={index}
        underlayColor="#F5F5F5"
        header={this.renderHeader(substitute, grams)}
        content={this.renderContent(grams, servingSizeText, substitute)}
        easing="easeOutCubic"
      />
    )
  }

  render() {
    let { foodSubstitutes } = this.props;

    return (
      <View style={styles.container}>
        {foodSubstitutes.map((substitute, index) => {
          return this.renderRow(substitute, index)
        })}
      </View>
    )
  }
}

let styles = {
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    paddingBottom: 10,
  },
  substituteRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEB"
  },
  substituteText: {
    fontSize: 15,
    marginLeft: 10,
    paddingTop: 5
  },
  converterBtnContainer: {
    padding: 5,
    borderRadius: 4,
    backgroundColor: 'white',
    borderColor: '#ACACAC'
  },
  listImage: {
    padding: 0,
    flex: 0,
    height: 30,
    width: 30
  },
  image: {
    height: 30,
    width: 30,
    alignSelf: 'center'
  }
};
