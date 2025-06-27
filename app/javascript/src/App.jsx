import { routes } from "constants/routes";

import React from "react";

import { Login, Signup } from "components/Authentication";
import Blogs from "components/Blogs";
import CreatePost from "components/Blogs/Create";
import DownloadBlog from "components/Blogs/DownloadBlog";
import EditPost from "components/Blogs/Edit";
import FilterPost from "components/Blogs/Filter";
import PreviewPost from "components/Blogs/Preview";
import ShowPost from "components/Blogs/Show";
import UserBlogs from "components/Blogs/UserBlogs";
import { SideBar, PrivateRoute } from "components/commons";
import { either, isEmpty, isNil } from "ramda";
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { getFromLocalStorage } from "utils/storage";

const App = () => {
  const authToken = getFromLocalStorage("authToken");
  const isLoggedIn = !either(isNil, isEmpty)(authToken);

  return (
    <Router>
      <ToastContainer />
      <div className="flex h-screen">
        {isLoggedIn && <SideBar />}
        <div className="flex-1 overflow-hidden">
          <Switch>
            <Route exact component={ShowPost} path={routes.blogs.show_blog} />
            <Route
              exact
              component={CreatePost}
              path={routes.blogs.create_blog}
            />
            <Route exact component={EditPost} path={routes.blogs.edit_blog} />
            <Route
              exact
              component={FilterPost}
              path={routes.blogs.filter_blogs}
            />
            <Route
              exact
              component={PreviewPost}
              path={routes.blogs.preview_blog}
            />
            <Route exact component={UserBlogs} path={routes.blogs.user_blogs} />
            <Route
              exact
              component={DownloadBlog}
              path={routes.blogs.download}
            />
            ;
            <PrivateRoute
              component={Signup}
              condition={!isLoggedIn}
              path="/signup"
              redirectRoute="/blogs"
            />
            <PrivateRoute
              component={Login}
              condition={!isLoggedIn}
              path="/login"
              redirectRoute="/blogs"
            />
            <PrivateRoute
              component={Blogs}
              condition={isLoggedIn}
              path="/"
              redirectRoute="/login"
            />
            <Redirect exact from={routes.root} to={routes.blogs.index} />
            {/* <Route exact component={PageNotFound} path={routes.pageNotFound} /> */}
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
