// @flow

import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated
} from 'react-native';

import Button from 'react-native-scrollable-tab-view/Button'

export const CustomTabBar = React.createClass({
  tabIcons: [],
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array
  },

  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
  },

  setAnimationValue({ value }) {
   this.tabIcons.forEach((icon, i) => {
     const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
   });
 },

  render() {
    return (
      <View style={[styles.tabs, this.props.style ]}>
        {this.props.tabs.map((tab, i) => {
          return (
            <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={this.props.activeTab === i ? styles.activeTab : styles.tab}>
              <Text
                style={{color:this.props.activeTab === i ? 'white' : '#737373'}}
                ref={(icon) => { this.tabIcons[i] = icon; }}
              >{tab}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    );
  }
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eaeaea',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  activeTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#13C7C8',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  tabs: {
    height: 40,
    flexDirection: 'row',
    flex: 0,
    padding: 0,
    margin: 0
  }
});
