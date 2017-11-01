// @flow

import React from 'react';
import ModalBox from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';

import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
} from 'react-native';

export default class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: true }
    this.close = this.close.bind(this);
    this.renderRightButton = this.renderRightButton.bind(this);
  }

  modalTitle() {
    return (
      <View style={styles.modalCenter}>
        <Text style={styles.title}>{this.props.title}</Text>
      </View>
    )
  }

  renderRightButton() {
    if(typeof(this.props.rightButton) === 'object') {
      return (
        <View style={styles.rightHeader}>
          {this.props.rightButton}
        </View>
      )
    }

    return(
      <View style={styles.rightHeader}></View>
    )
  }

  modalHeader() {
    return (
      <View style={styles.modalHeader}>
        {this.closeButton()}
        {this.modalTitle()}
        {this.renderRightButton()}
      </View>
    )
  }

  closeButton() {
    return(
      <View style={styles.leftHeader}>
        <TouchableHighlight
          style={styles.modalButton}
          underlayColor="#FFFFFF"
          onPress={this.close}>

          <Text style={{color: '#22BCED', fontWeight: 'bold', fontSize: 16}}>cancel</Text>
        </TouchableHighlight>
      </View>
    );
  }

  close() {
    if(this.props.onClose) {
      this.props.onClose();
    } else {
      Actions.pop();
    }
  }

  render() {
    let component = this.props.modalComponent;

    if(Array.isArray(component)) {
      component = component.map((c) => {
        return React.cloneElement(c, { closeModal: this.close });
      })
    } else {
      component = React.cloneElement(this.props.modalComponent, { closeModal: this.close });
    }

    return (
      <ModalBox style={styles.modal}
        isOpen={this.state.isOpen}
        backdrop={true}
        swipeToClose={false}
        onClosed={this.close}
        position='top'
        animationDuration={200}>

        <View style={styles.modalContent}>
          {this.modalHeader()}
          {component}
        </View>

      </ModalBox>
    )
  }
}

let styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#C6C6C6',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftHeader: {
    flex: 0.2,
  },
  modalCenter: {
    flex: 0.6,
  },
  rightHeader: {
    flex: 0.2,
    justifyContent: 'center',
  },
  title: {
    flexDirection: 'row',
    color: '#000000',
    textAlign:'center',
    fontWeight: 'bold',
    fontSize: 18,
    paddingTop: 30,
    paddingBottom: 10,
  },
  modalButton: {
    alignSelf: 'center',
    paddingTop: 30,
    paddingBottom: 10
  },
  modalContent: {
    flex: 1
  },
  modal: {
    backgroundColor: '#EEEEEE',
  },
});
