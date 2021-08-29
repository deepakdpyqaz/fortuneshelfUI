import PrivacyPolicy from "./PrivacyPolicy";
import TermsAndConditions from "./TermsAndConditions";
import ShippingPolicy from "./ShippingPolicy";
import CancellationPolicy from "./CancellationPolicy";
import { Switch, Route, BrowserRouter } from "react-router-dom";
const About = () => {
    return (
        <div className="view_page">

            <BrowserRouter>
                <Switch>
                    <Route exact path="/about/privacy_policy">
                        <PrivacyPolicy />
                    </Route>
                    <Route exact path="/about/terms_and_conditions">
                        <TermsAndConditions />
                    </Route>
                    <Route exact path="/about/shipping_policy">
                        <ShippingPolicy />
                    </Route>
                    <Route exact path="/about/cancellation_policy">
                        <CancellationPolicy />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    )
}
export default About;