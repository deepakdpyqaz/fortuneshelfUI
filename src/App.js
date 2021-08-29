import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, useLocation } from "react-router-dom";
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
import Footer from "./components/Footer";
import MyOrder from "./views/MyOrder";
import Profile from "./views/Profile";
import axios from "axios";
import TrackOrder from "./views/TrackOrder";
import { reactLocalStorage } from "reactjs-localstorage";
import { login, logout } from "./reducers/auth";
import { useDispatch } from "react-redux";
import ResetPassword from "./views/ResetPassword";
import ScrollToTop from "./ScrollToTop";
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="*">
          <AnimationApp />
        </Route>
      </Switch>
    </Router>
  )
}
function AnimationApp() {
  const dispatch = useDispatch();
  let location = useLocation();
  useEffect(() => {
    let token = reactLocalStorage.get("token");
    if (token) {
      axios.post("/user/login_token", { token }).then((res) => {
        if (res.data) {
          dispatch(login(res.data));
          reactLocalStorage.set("token", res.data.token);
          axios.defaults.headers.authorization = res.data.token;
        }
      }).catch(() => {
        reactLocalStorage.remove("token");
        dispatch(logout());
      })
    }
  })
  return (

    <div className="App">
      <ScrollToTop />
      <Header />
      <TransitionGroup>
        <CSSTransition
          key={location.key}
          classNames="fade"
          timeout={1000}
        >
          <Switch>
            <Route exact path="/">
              <Home />
              <Footer />
            </Route>
            <Route exact path="/viewbook">
              <ViewBook />
            </Route>
            <Route path="/search">
              <SearchBook />
              <Footer />
            </Route>
            <Route path="/viewbook/:bookId">
              <ViewFullBook />
              <Footer />
            </Route>
            <Route path="/checkout">
              <Checkout />
              <Footer />
            </Route>
            <Route path="/signup">
              <Signup />
              <Footer />
            </Route>
            <Route path="/login">
              <Login />
              <Footer />
            </Route>
            <Route path="/trackorder">
              <TrackOrder />
              <Footer />
            </Route>
            <Route path="/about">
              <About />
              <Footer />
            </Route>
            <Route path="/myorder">
              <MyOrder />
              <Footer />
            </Route>
            <Route path="/profile">
              <Profile />
              <Footer />
            </Route>
            <Route path="/reset_password">
              <ResetPassword />
              <Footer />
            </Route>
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

export default App;
