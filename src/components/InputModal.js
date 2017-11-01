// @flow

import React from 'react';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import dismissKeyboard from 'dismissKeyboard'

import {DateInput, HeightInput, NumberInput, PrePostWorkoutInput} from './inputs'

import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
} from 'react-native';

class InputModal extends React.Component {
  constructor(props) {
    super(props);
    this.onClosed = this.onClosed.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);

    this.state = {open: false}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open)
      dismissKeyboard();
  }

  modalTitle() {
    return (
      <Text style={styles.title}>{this.props.title}</Text>
    )
  }

  modalHeader() {
    return (
      <View style={[styles.modalHeader, this.props.titleStyle]}>
        {this.modalTitle()}
        {this.checkButton()}
      </View>
    )
  }

  checkButton() {
    if (this.props.save) {
      return (
        <TouchableHighlight
          style={styles.modalButton}
          underlayColor='#2B99F5'
          onPress={() => {
            if (this.input) {
              switch (this.props.type) {
                case 'timeWorkout':
                  this.props.save({
                    pre: this.input.state.pre,
                    post: this.input.state.post
                  }, false);
                  break;
                default:
                  this.props.save(this.input.state[this.props.type], false);
                  break;
              }
            } else {
              this.props.save()
            }
          }}>
          <Icon
            name='check'
            size={20}
            color='#ffffff'/>
        </TouchableHighlight>
      )
    }
    return null;
  }

  onClosed() {
    if (this.props.onClosed) {
      this.props.onClosed();
    }
  }

  onChange(val) {
    this.props.save(val, true)
  }

  onSave(val) {
    this.props.onSave(val)
  }

  render() {
    let height = {height: this.props.height};

    let child = this.props.children;

    if (this.props.type) {
      switch (this.props.type) {
        case 'date':
          let val = this.props.value ? this.props.value.initialValue || this.props.value : null;
          child = <DateInput ref={(input) => {
            this.input = input
          }} value={val} onChange={this.onChange}/>;
          break;
        case 'height':
          child = <HeightInput ref={(input) => {
            this.input = input
          }} selectedHeight={this.props.selected.value} onChange={this.onChange}/>;
          break;
        case 'timeWorkout':
          child = <PrePostWorkoutInput
            style={{marginVertical: 15}}
            ref={(input) => {
              this.input = input
            }}
            meals={this.props.meals}
            onChange={this.onChange}
            value={this.props.value}/>;
          break;
      }
    }

    let modal = <Modal style={[styles.modal, height]}
                       backdrop={true}
                       isOpen={this.props.open}
                       position="bottom"
                       swipeToClose={false}
                       onClosed={this.onClosed}
                       backdropPressToClose={false}
                       animationDuration={200}>
      <View style={styles.container}>
        {this.modalHeader()}
        <View style={styles.modalContent}>
          {child}
        </View>
      </View>
    </Modal>

    return modal
  }
}

let styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    backgroundColor: '#4faaf6',
    padding: 4
  },
  title: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 18,
    flex: 1,
    paddingTop: 5,
    paddingBottom: 5,
  },
  modalButton: {
    position: 'absolute',
    right: 10,
    paddingTop: 10,
    paddingBottom: 5,
  },
  modal: {
    top: 0,
    position: 'absolute',
    backgroundColor: '#ffffff',
  },
  modalContent: {}
});

export default InputModal;
