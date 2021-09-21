import React, { useEffect, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route, useLocation,Redirect,useHistory } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FallbackLoader from "./components/FallBackLoader";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import { login, logout } from "./reducers/auth";
import { useDispatch } from "react-redux";
import ScrollToTop from "./ScrollToTop";
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group";
import {useAlert} from "react-alert";
import { setCartItems } from "./reducers/cart";
const Home = React.lazy(() => import('./views/Home'));
const ViewBook = React.lazy(() => import("./views/ViewBook"));
const SearchBook = React.lazy(() => import("./views/SearchBook"));
const ViewFullBook = React.lazy(() => import("./views/ViewFullBook"));
const Checkout = React.lazy(() => import("./views/Checkout"));
const Signup = React.lazy(() => import("./views/Signup"));
const Login = React.lazy(() => import("./views/Login"));
const About = React.lazy(() => import("./views/About"));
const MyOrder = React.lazy(() => import("./views/MyOrder"));
const Profile = React.lazy(() => import("./views/Profile"));
const ResetPassword = React.lazy(() => import("./views/ResetPassword"));
const TrackOrder = React.lazy(() => import("./views/TrackOrder"));
const Confirmation = React.lazy(()=>import("./views/Confirmation"));
const OrderResponse = React.lazy(()=>import("./views/OrderResponse"));
const AboutAuthor = React.lazy(()=>import("./views/AboutAuthor"));
const Contact = React.lazy(()=>import("./views/Contact"));


function UserApp() {
  const dispatch = useDispatch();
  let location = useLocation();
  const history=useHistory();
  const alert = useAlert();
  useEffect(() => {
    let token = reactLocalStorage.get("token");
    let cart = reactLocalStorage.getObject("cart");
    if(cart){
      axios.post("/validate_cart",{"cart":cart}).then((res)=>{
        reactLocalStorage.setObject("cart",res.data.cart);
        dispatch(setCartItems(res.data.cart));
      }).catch((err)=>{
        reactLocalStorage.setObject("cart",{});
        dispatch(setCartItems({}))
        alert.error("Error in updating cart");
      })
    }
    if (token) {
      axios.post("/user/login_token", { token }).then((res) => {
        if (res.data) {
          dispatch(login(res.data));
          reactLocalStorage.set("token", res.data.token);
          axios.defaults.headers.authorization = res.data.token;
          if(location.state && location.state.pathname){
            history.push(location.state.pathname);
          }
        }
      }).catch((err) => {
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
          <Suspense fallback={<FallbackLoader/>}>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/viewbook">
                <ViewBook />
              </Route>
              <Route path="/search">
                <SearchBook />
              </Route>
              <Route path="/viewbook/:bookId">
                <ViewFullBook />
              </Route>
              <Route path="/checkout">
                <Checkout />
              </Route>
              <Route path="/signup">
                <Signup />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/trackorder">
                <TrackOrder />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/myorder">
                <MyOrder />
              </Route>
              <Route path="/profile">
                <Profile />
              </Route>
              <Route path="/reset_password">
                <ResetPassword />
              </Route>
              <Route path="/confirm_order">
                <Confirmation/>
              </Route>
              <Route path="/order/status">
                <OrderResponse/>
              </Route>
              <Route path="/about_author">
                <AboutAuthor/>
              </Route>
              <Route path="/Contact">
                <Contact/>
              </Route>
              <Route path="*">
                <Redirect to="/"></Redirect>
              </Route>
            </Switch>
          </Suspense>
        </CSSTransition>
      </TransitionGroup>
      <Footer />
    </div>
  );
}


export default UserApp;
