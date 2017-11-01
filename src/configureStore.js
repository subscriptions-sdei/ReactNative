// @flow

var { AsyncStorage } = require('react-native');

import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from './reducers/AppReducer';

import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import devTools from 'remote-redux-devtools';
const loggerMiddleware = createLogger();
const middlewares = [thunkMiddleware];

if (__DEV__) {
  middlewares.push(loggerMiddleware);
  // Reactotron
  //   .configure({name: 'LiteHQ'})
  //   .use(reactotronRedux())
}

// const store = __DEV__ ? Reactotron.createStore(rootReducer, {}, applyMiddleware(...middlewares)) : createStore(
const store = createStore(
  rootReducer,
  {},
  compose(
    autoRehydrate(),
    applyMiddleware(...middlewares)
  )
)

if (module.hot) {
  module.hot.accept(() => {
    const nextRootReducer = require('./reducers/AppReducer').default;
    store.replaceReducer(nextRootReducer);
  });
}

export default function configureStore() {
  persistStore(store, { storage: AsyncStorage, blacklist: ['newClient', 'form'] });
  return store;
}
