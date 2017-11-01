// @flow

import React from 'react';

import Accordion from 'libs/Accordion'

class AccordionMacros extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.setMacros = this.setMacros.bind(this);

    this.state = {
      isVisible: false,
      macros: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }
    }
  }

  toggle(visible) {
    this.setState({isVisible: visible});
    if (visible && this.props.food) {
      this.setState({
        macros: {
          calories: this.props.food.calories,
          protein: this.props.food.protein,
          carbs: this.props.food.carbs,
          fat: this.props.food.fat,
        }
      });
    }
  }

  setMacros(m) {
    this.setState({
      macros: {
        calories: m.calories,
        protein: m.protein,
        carbs: m.carbs,
        fat: m.fat
      }
    });
  }

  close() {
    this.accordion.close();
  }

  render() {
    return <Accordion
        {...this.props}
        wrapper={this}
        toggle={this.toggle}
        ref={(accordion) => {
          this.accordion = accordion
        }} />
  }
}

export default AccordionMacros;
