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

export default class HeightInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = { height: props.selectedHeight || 150 };
  }

  onChange(height) {
    this.setState({ height });
    this.props.onChange(height);
  }

  render() {
    const heights = _.range(100, 251);
    let { height } = this.state;

    return (
      <View style={styles.picker}>
        <Picker
          style={{flex:1}}
          mode="dialog"
          selectedValue={parseInt(height)}
          onValueChange={ (height) => { this.onChange(height) }}>

          {heights.map((height) => {
            return <Picker.Item key={height} value={height} label={height.toString()} />
          })}
        </Picker>
        <Picker style={{flex:1}} mode="dialog">
          <Picker.Item label="cm" value="cm" />
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
