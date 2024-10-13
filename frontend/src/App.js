import React from "react";
import "./style/app.css";
import { Route, Switch } from "react-router-dom";
import Home from "./page/Home";
import NewRoom from "./components/Room/Room";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import ForgetPassword from "./components/Auth/ForgetPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import ChackUser from "./components/Routes/ChackUser";

const App = () => {
  return (
    <>
      <ChackUser exact path="/user/login" component={Login} />
      <ChackUser exact path="/user/signup" component={SignUp} />
      <ChackUser
        exact
        path="/user/forget-password"
        component={ForgetPassword}
      />
      <Route
        exact
        path="/user/reset-password/:resetToken"
        component={ResetPassword}
      />

      <Switch>
        <Route path="/" exact component={Home} />
        <Route exact path="/new/room/:roomID">
          <NewRoom />
        </Route>
      </Switch>
    </>
  );
};

export default App;
