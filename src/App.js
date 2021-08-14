import React from "react";
// import {BrowserRouter, Switch, Route} from "react-router-dom";
import Header from "./components/Header";
import Home from "./views/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <div className="App">
      <Header/>
      <Home/>
    </div>
  );
}

export default App;
