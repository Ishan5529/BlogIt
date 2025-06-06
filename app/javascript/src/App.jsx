import { routes } from "constants/routes";

import React from "react";

import Blogs from "components/Blogs";
// import { SideBar, PageNotFound } from "components/commons";
import { SideBar } from "components/commons";
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

const App = () => (
  <Router>
    <ToastContainer />
    <div className="flex h-screen">
      <SideBar />
      <div className="flex-1 overflow-hidden p-4">
        <Switch>
          <Route exact component={Blogs} path={routes.blogs} />
          <Redirect exact from={routes.root} to={routes.blogs} />
          {/* <Route exact component={PageNotFound} path={routes.pageNotFound} /> */}
        </Switch>
      </div>
    </div>
  </Router>
);

export default App;
