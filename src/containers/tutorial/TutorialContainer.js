// @flow

import React, { Component, PropTypes } from 'react';
import { View, Image, TouchableOpacity,Text, AsyncStorage } from 'react-native';
import AppIntro from 'react-native-app-intro';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { viewedTutorial } from 'reducers/auth/AuthActions';

class TutorialContainer extends Component {
  countinue = async () => {
    let user = this.props.user;
    user.viewedTutorial = true;
    await this.props.dispatch(viewedTutorial(user));
    await Actions.pop();
  };

  render(){
    return(
      <AppIntro showDots={true} showSkipButton={false} onDoneBtnClick={this.countinue}>
        <Image style={styles.container} source={{ uri: 'screen1.jpg'.replace('jpg', 'png') }} />
        <Image style={styles.container} source={{ uri: 'screen2.jpg'.replace('jpg', 'png') }} />
        <Image style={styles.container} source={{ uri: 'screen3.jpg'.replace('jpg', 'png') }} />
      </AppIntro>
    );
  }
}

let styles = {
  container: {
    flex:1
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(TutorialContainer)
