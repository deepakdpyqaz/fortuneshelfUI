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
function AdminApp() {
    const dispatch = useDispatch();
    let location = useLocation();
    // useEffect(() => {
    //     let token = reactLocalStorage.get("token");
    //     if (token) {
    //         axios.post("/user/login_token", { token }).then((res) => {
    //             if (res.data) {
    //                 dispatch(login(res.data));
    //                 reactLocalStorage.set("token", res.data.token);
    //                 axios.defaults.headers.authorization = res.data.token;
    //             }
    //         }).catch(() => {
    //             reactLocalStorage.remove("token");
    //             dispatch(logout());
    //         })
    //     }
    // })
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