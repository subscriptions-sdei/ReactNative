// @flow

let React = require('react');

import { RadioButtons } from 'react-native-radio-buttons'

import {
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
} from 'react-native'

export default class OptionInput extends React.Component {
  constructor(props) {
    super(props);
    this.setSelectedOption = this.setSelectedOption.bind(this);

    this.state = {
      selectedOption: ''
    }
  }

  renderOption(option, selected, onSelect, index) {
    const baseStyle = {
      flexDirection: 'row',
    };

    let style;
    let checkMark;

    if (index > 0) {
      style = [baseStyle, {
        borderTopColor: '#eeeeee',
        borderTopWidth: 1,
      }];
    } else {
      style = baseStyle;
    }

    if (selected) {
      checkMark = <Text style={styles.checkMark}>✓</Text>;
    }

    let renderContent = () => {
      if(option.description) {
        return (
          <View style={style} key={option.title}>
            <View style={{flexDirection: 'column', flex: 0.9}}>
              <Text style={{ paddingTop: 5, paddingBottom: 20, color: 'black', flex: 1, fontSize: 14 }}>{option.title}</Text>
              <Text style={{fontSize: 11, paddingBottom: 5, color: '#807E7E'}}>{option.description}</Text>
            </View>
            <View style={{marginTop: 10, marginRight: 10}}>
              {checkMark}
            </View>
          </View>
        );
      } else {
        return (
          <View style={style} key={option.title}>
            <Text style={styles.textStyle}>{option.title}</Text>
            {checkMark}
          </View>
        )
      }
    }

    return (
      <TouchableWithoutFeedback onPress={onSelect} key={index}>
        {renderContent()}
      </TouchableWithoutFeedback>
    );
  }

  setSelectedOption(selectedOption){
    this.setState({selectedOption: selectedOption.title});
    this.props.onChange(selectedOption.title);
  }

  renderContainer(options){
    return (
      <View style={{
        backgroundColor: 'white',
        paddingLeft: 20,
        borderTopWidth: 1,
        borderTopColor: '#cccccc',
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc'}}>

        {options}
      </View>
    );
  }

  render() {
    const { options } = this.props;

    let selectedIndex = options.map(o => o.title)
                               .findIndex(x => x === this.props.selectedOption);

    return (
      <View>
        <View style={{marginTop: 10, backgroundColor: 'white'}}>
          <View style={{
            backgroundColor: '#eeeeee',
            paddingTop: 5,
            paddingBottom: 5}}>

            <Text style={{
              color: '#555555',
              paddingLeft: 10,
              marginBottom: 5,
              marginTop: 5,
              fontSize: 12}}>
              {this.props.header}
            </Text>

            <RadioButtons
              options={options}
              onSelection={this.setSelectedOption}
              selectedOption={this.state.selectedOption || this.props.selectedOption}
              selectedIndex={selectedIndex}
              renderOption={this.renderOption}
              renderContainer={this.renderContainer} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textStyle: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 12,
    color: 'black',
    fontSize: 14,
  },
  checkMark: {
    flex: 0.1,
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf: 'center',
  }
});
