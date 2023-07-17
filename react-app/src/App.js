import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import TuringMachinePage from "./components/TuringMachinePage";
import CreateMachineForm from "./components/TuringMachineForm/CreateMachineForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          {/* <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route> */}
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/turing-machines/new">
            <CreateMachineForm />
          </Route>
          <Route exact path="/machines/:machineId">
            <TuringMachinePage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
