import { create } from 'domain';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import App from './App';
import chainReducer from './store/reducers/chain';
import blockReducer from './store/reducers/advancedBlock';


const composeEnhancers = compose;

const rootReducer = combineReducers({
  chain: chainReducer,
  block: blockReducer
});

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk)
));

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(
  app,
  document.getElementById('root')
);
