import React, { Suspense } from "react";
import { BrowserRouter as Router, Switch, Route, useLocation } from "react-router-dom";
import FallbackLoader from "./components/FallBackLoader";
const UserApp = React.lazy(()=>import("./User"));
const AdminApp = React.lazy(()=>import("./Admin"));
function App() {
  return (
    <Router>
      <Suspense fallback={<FallbackLoader/>}>
      <Switch>
        <Route path="/admin">
          <AdminApp/>
        </Route>
        <Route path="*">
          <UserApp />
        </Route>
      </Switch>
      </Suspense>
    </Router>
  )
}


export default App;
