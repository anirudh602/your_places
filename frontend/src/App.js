import React, { useEffect, useState , Suspense} from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
} from "react-router-dom";
import { AuthContext } from "./shared/Context/auth-context";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import "./App.css";

import MainNavigation from "./shared/Navigation/MainNavigation";



import useAuth from "./shared/util/auth-hook";
import LoadingSpinner from "./shared/UIElements/LoadingSpinner";

const Authenticate = React.lazy(() => import("./user/pages/Authenticate"))
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"))
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"))


let logoutTimer;
const App = () => {
  const { userId, token, expire, login, logout } = useAuth();
  


  let routes;

  if (!!token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/:uid/places" exact>
          <UserPlaces />
        </Route>
       
        <Route path="/places/:pid" exact>
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:uid/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth" exact>
          <Authenticate />
        </Route>

        <Redirect to="/auth" />
      </Switch>
    );
  }
  console.log(routes);
  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, token: token, login: login, logout: logout, userId: userId}}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense fallback = {<div className = "center"><LoadingSpinner/></div>}>{routes}</Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
