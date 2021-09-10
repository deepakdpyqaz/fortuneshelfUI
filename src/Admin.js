import React, { useEffect, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route, useLocation,Redirect } from "react-router-dom";
import FallbackLoader from "./components/FallBackLoader";
import Footer from "./components/Footer"
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import { useDispatch,connect } from "react-redux";
import ScrollToTop from "./ScrollToTop";
import {
    TransitionGroup,
    CSSTransition
} from "react-transition-group";
import Header from "./components/Admin/Header";
const Login = React.lazy(() => import("./views/Admin/Login"));
const Book = React.lazy(()=>import("./views/Admin/Book"));
const BookView = React.lazy(()=>import("./views/Admin/BookView"));
const Order = React.lazy(()=>import("./views/Admin/Order"));
const OrderView = React.lazy(()=>import("./views/Admin/OrderView"));
const Payment = React.lazy(()=>import("./views/Admin/Payments"));
const Profile = React.lazy(()=>import("./views/Admin/Profile"));
const Admins = React.lazy(()=>import("./views/Admin/Admins"));
const ResetPassword = React.lazy(()=>import("./views/Admin/ResetPassword"));
const Coupons = React.lazy(()=>import("./views/Admin/Coupons"));
const AddCoupon = React.lazy(()=>import("./views/Admin/AddCoupon"));
function AdminApp() {
    const dispatch = useDispatch();
    let location = useLocation();
    return (

        <div className="App">
            <ScrollToTop />
            <TransitionGroup>
                <CSSTransition
                    key={location.key}
                    classNames="fade"
                    timeout={1000}
                >
                    <Header>
                        <Suspense fallback={<FallbackLoader />}>
                            <Switch>
                                <Route exact path="/admin/login">
                                    <Login />
                                </Route>
                                <Route exact path="/admin/books">
                                    <Book />
                                </Route>
                                <Route exact path="/admin/books/:bookId">
                                    <BookView />
                                </Route>
                                <Route exact path="/admin/order">
                                    <Order/>
                                </Route>
                                <Route exact path="/admin/order/:orderId">
                                    <OrderView/>
                                </Route>
                                <Route exact path="/admin/payment">
                                    <Payment/>
                                </Route>
                                <Route exact path="/admin/admins">
                                    <Admins/>
                                </Route>
                                <Route exact path="/admin/profile/:id">
                                    <Profile/>
                                </Route>
                                <Route exact path="/admin/reset_password">
                                    <ResetPassword />
                                </Route>
                                <Route exact path="/admin/coupons">
                                    <Coupons />
                                </Route>
                                <Route exact path="/admin/coupons/add">
                                    <AddCoupon />
                                </Route>
                                <Route path="*">
                                    <Redirect to="/admin/login"></Redirect>
                                </Route>
                            </Switch>
                        </Suspense>
                    </Header>

                </CSSTransition>
            </TransitionGroup>
        </div>
    );
}
export default AdminApp;