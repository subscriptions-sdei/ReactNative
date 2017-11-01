// @flow

import React, { PropTypes } from 'react';
import tweenState from 'react-tween-state';

import {
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

var Accordion = React.createClass({
  mixins: [tweenState.Mixin],

  propTypes: {
    activeOpacity: React.PropTypes.number,
    animationDuration: React.PropTypes.number,
    content: React.PropTypes.oneOfType([
      React.PropTypes.element.isRequired,
      React.PropTypes.func.isRequired
    ]),
    easing: React.PropTypes.string,
    expanded: React.PropTypes.bool,
    header: React.PropTypes.oneOfType([
      React.PropTypes.element.isRequired,
      React.PropTypes.func.isRequired
    ]),
    onPress: React.PropTypes.func,
    underlayColor: React.PropTypes.string,
    style: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      activeOpacity: 1,
      animationDuration: 300,
      easing: 'linear',
      expanded: false,
      underlayColor: '#000',
      style: {}
    };
  },

  getInitialState() {
    return {
      isVisible: false,
      height: 0,
      contentHeight: 0,
    };
  },

  close() {
    this.state.isVisible && this.toggle();
  },

  open() {
    !this.state.isVisible && this.toggle();
  },

  toggle() {
    const visible = this.state.isVisible;

    if (this.props.toggle) this.props.toggle(!visible)

    this.setState({
      'isVisible': !visible
    })

    this.tweenState('height', {
      easing: tweenState.easingTypes[this.props.easing],
      duration: this.props.animationDuration,
      endValue: this.state.height === 0 ? this.state.contentHeight : 0
    });
  },

  _onPress() {
    this.toggle();

    if (this.props.onPress) {
      this.props.onPress.call(this, this);
    }
  },

  _getContentHeight() {
    if (this.refs.AccordionContent) {
      this.refs.AccordionContent.measure((ox, oy, width, height, px, py) => {
        // Sets content height in state
        this.setState({
          height: this.props.expanded ? height : 0,
          contentHeight: height
        });
      });
    }
  },

  componentDidMount() {
    // Gets content height when component mounts
    // without setTimeout, measure returns 0 for every value.
    // See https://github.com/facebook/react-native/issues/953
    setTimeout(this._getContentHeight);
  },

  render() {
    function isFunction(functionToCheck) {
     var getType = {};
     return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }

    let header = isFunction(this.props.header) ? this.props.wrapper ? this.props.header(this.props.wrapper) : this.props.header(this) : this.props.header
    let content = isFunction(this.props.content) ? this.props.wrapper ? this.props.content(this.props.wrapper) : this.props.content(this) : this.props.content

    return (
      /*jshint ignore:start */
      <View
        style={{overflow: 'hidden'}} >
        <TouchableHighlight
          ref="AccordionHeader"
          onPress={this._onPress}
          underlayColor={this.props.underlayColor}
          style={this.props.style} >
          {header}
        </TouchableHighlight>
        <View
          ref="AccordionContentWrapper"
          style={{
            height: this.getTweeningValue('height'),
            overflow: 'scroll'
          }} >
          <View ref="AccordionContent">
            {content}
          </View>
        </View>
      </View>
      /*jshint ignore:end */
    );
  }
});

module.exports = Accordion;
