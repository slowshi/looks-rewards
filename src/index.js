import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Compare from './routes/Compare/Compare.js';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import store from './store/store';
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.render(
    <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route path="/compare" element={<Compare />}></Route>
      </Routes>
    </BrowserRouter>
    </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();