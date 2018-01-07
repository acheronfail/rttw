import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createEpicMiddleware } from 'redux-observable';
import { createStore, applyMiddleware } from 'redux';
import { rootReducer, rootEpic } from './state/';

import registerServiceWorker from './registerServiceWorker';
import App from './app/app';

const epicMiddleware = createEpicMiddleware(rootEpic);

let middleware;
if (process.env.NODE_ENV === 'development') {
  const { composeWithDevTools } = require('redux-devtools-extension');
  middleware = composeWithDevTools(applyMiddleware(epicMiddleware));
} else {
  middleware = applyMiddleware(epicMiddleware);
}

const store = createStore(rootReducer, middleware);
const urlParams = new URLSearchParams(window.location.hash.replace('#', '?'));

render(
  <Provider store={store}>
    <App urlParams={urlParams} />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
