// @flow

console.disableYellowBox = true;

import React from 'react';
import codePush from "react-native-code-push";
import { Provider } from 'react-redux';
import AppContainer from 'containers/AppContainer';
import configureStore from './configureStore';
import HockeyApp from 'react-native-hockeyapp';

import { MenuContext } from 'react-native-menu';

let store = configureStore();

export default class App extends React.Component {
  componentWillMount() {
    HockeyApp.configure("599880d7adfc41fd88284aba546b8e5c", true);
  }

  componentDidMount() {
    if (!__DEV__) {
      HockeyApp.start();
      HockeyApp.checkForUpdate();
      codePush.sync({ updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE });
    }
  }

  render() {
    return(
      <MenuContext style={{flex:1}}>
        <Provider store={store}>
          <AppContainer />
        </Provider>
      </MenuContext>
    );
  }
}
