// @flow

import React from 'react';
import { Provider } from 'react-redux';
import { AppRegistry } from 'react-native';
import reducers from './configs/configReducers';
import thunk from 'redux-thunk';
import { compose } from 'redux';
import { createStore, applyMiddleware } from 'redux';
import App from './app/AppContainer';
import type { Store } from './types';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store: Store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunk))
);

const FirstDigitalBank = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent('inkittChapterReading', () => FirstDigitalBank);
