import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./index.scss";
import axios from "axios";
import config from "./config";
import { Provider } from 'react-redux';
import store from './store';
import { positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
const options = {
  timeout: 3000,
  position: positions.TOP_CENTER,
  offset:"2vh",
  containerStyle:{
    justifyContent:"stretch",
    zIndex:10000,
    textTransform:"capitalize"
  }
};

axios.defaults.baseURL=config.backendUrl;
// ReactDOM.render(

//   <>
//     <Provider store={store}>
//       <AlertProvider template={AlertTemplate} {...options}>
//         <App />
//       </AlertProvider>
//     </Provider>
//   </>,
//   document.getElementById('root')
// );
const AppElement = (
  <>
      <Provider store={store}>
      <AlertProvider template={AlertTemplate} {...options}>
        <App />
      </AlertProvider>
    </Provider>
  </>
)
const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrate(AppElement, rootElement);
} else {
  ReactDOM.render(AppElement, rootElement);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
