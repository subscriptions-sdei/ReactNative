// @flow

let React = require('react');

import Dimensions from 'Dimensions';
let width = Dimensions.get('window').width;
import _ from 'lodash';

import {
  View,
  StyleSheet,
  Picker
} from 'react-native'

export default class WeightInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    let weight = props.selectedWeight ? props.selectedWeight.toString() : '60.0'
    let w = weight.split('.');
    this.state = { weight: w[0], fractionWeight:w[1] };
  }

  onFractionChange(fractionWeight) {
    this.setState({fractionWeight});
    let weight = this.state.weight;
    this.props.onChange((weight.toString().concat('.')).concat(fractionWeight.toString()));
  }

  onChange(weight) {
    let fractionWeight = this.state.fractionWeight;
    this.setState({ weight });
    this.props.onChange((weight.toString().concat('.')).concat(fractionWeight.toString()));
  }

  render() {
    let { weight,fractionWeight } = this.state;
    const weightIntegers = _.range(40, 201);
    const weightFractionals = _.range(0, 10);

    return (
      <View style={styles.picker}>
        <Picker
          style={{flex:1}}
          mode="dialog"
          selectedValue={parseInt(weight)}
          onValueChange={ (weight) => { this.onChange(weight) }}>

          {weightIntegers.map((w) => {
            return <Picker.Item key={w} value={w} label={w.toString()} />
          })}
        </Picker>
        <Picker
          style={{flex:1}}
          mode="dialog"
          selectedValue={parseInt(fractionWeight)}
          onValueChange={ (fwt) => { this.onFractionChange(fwt) }}>

          {weightFractionals.map((w) => {
            return <Picker.Item key={w} value={w} label={w.toString()} />
          })}
        </Picker>
        <Picker style={{flex:1}} mode="dialog">
          <Picker.Item label="kg" value="kg" />
        </Picker>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  picker: {
    flexDirection:'row',
    width: width
  }
});
