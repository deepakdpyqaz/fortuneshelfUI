import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { useLocation } from "react-router";
import Header from "./components/Header";
import Home from "./views/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewBook from "./views/ViewBook";
import SearchBook from "./views/SearchBook";
import ViewFullBook from "./views/ViewFullBook";
import Checkout from "./views/Checkout";
import Signup from "./views/Signup";
import Login from "./views/Login";
import About from "./views/About";
import axios from "axios";
function App() {
  return (
    <Router>

    <div className="App">
      <Switch>
      <Route exact path="/">
        <Header stickyMode={true}/>
        <Home/>
      </Route>
      <Route exact path="/viewbook">
        <Header stickyMode={false}/>
        <ViewBook/>
      </Route>
      <Route  path="/search">
        <Header stickyMode={false}/>
        <SearchBook/>
      </Route>
      <Route  path="/viewbook/:bookId">
        <Header stickyMode={false}/>
        <ViewFullBook/>
      </Route>
      <Route  path="/checkout">
        <Header stickyMode={false}/>
        <Checkout/>
      </Route>
      <Route  path="/signup">
        <Header stickyMode={false}/>
        <Signup/>
      </Route>
      <Route  path="/login">
        <Header stickyMode={false}/>
        <Login/>
      </Route>
      <Route  path="/about">
        <Header stickyMode={false}/>
        <About/>
      </Route>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
