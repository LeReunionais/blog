import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import articlesApp from './reducer/articles.js';
import Main from './main.jsx!';

let store = createStore(
  articlesApp,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware()
  )
);

render(
  <Provider store={store}>
    <Main/>
  </Provider>,
  document.getElementById('placeholder')
)
