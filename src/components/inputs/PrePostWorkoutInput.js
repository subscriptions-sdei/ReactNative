import React from 'react';

import {Slider, Text, View, StyleSheet} from 'react-native';

export default class PrePostWorkoutInput extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.isNearSelected = this.isNearSelected.bind(this);

    this.state = {
      pre: props.value.pre,
      post: props.value.post,
      value: (props.value.post || 0) === 0 ? 1 : (props.value.post || 0) / props.meals.value - (1/props.meals.value),
      meals: props.meals.value
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pre: nextProps.value.pre,
      post: nextProps.value.post,
      value: nextProps.value.pre / nextProps.meals.value
    });
  }

  onChange(value) {
    let pre = Math.round(value / (1 / this.props.meals.value));
    let post = this.props.meals.value < (pre + 1) ? 0 : pre + 1;

    this.setState({
      pre,
      post
    });

    this.props.onChange({
      pre,
      post
    });
  }

  isNearSelected(i: number) {

    let style = {};

    if (!this.state.pre && i === 1) {
      style = {
        fontWeight: 'bold'
      }
    }

    if (this.state.post && this.state.post === i && this.state.pre && this.state.pre === i - 1) {
      style = {
        fontWeight: 'bold'
      }
    }

    if (this.state.pre && i === this.state.pre) {
      style = {
        fontWeight: 'bold'
      }
    }

    return style;
  }

  render() {
    let step = 1 / this.state.value, numbers = [], msg = 'Loading...';

    if (this.state.pre && this.state.post) {
      msg = 'Between Meal ' + this.state.pre + ' and Meal ' + this.state.post
    }

    if (!this.state.pre && this.state.post) {
      msg = 'Before Meal ' + this.state.post
    }

    if (this.state.pre && !this.state.post) {
      msg = 'After Meal ' + this.state.pre
    }

    for (let i = 1; i <= this.state.meals; i++) {
      numbers.push(
        <Text key={i} style={this.isNearSelected(i)}>{i}</Text>
      )
    }

    return (
      <View style={style.container}>
        <View style={style.numbers}>{numbers}</View>
        <Slider step={step} value={this.state.value} onValueChange={this.onChange}/>
        <Text style={{textAlign:'center'}}>{msg}</Text>
      </View>
    )
  }
}

let style = StyleSheet.create({
  container: {
    paddingVertical: 20
  },
  numbers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20
  }
});
