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
import UpdateMachineForm from "./components/TuringMachineForm/UpdateMachineForm";
import CreateInstructionForm from "./components/InstructionForm/CreateInstructionForm";
import UpdateInstructionForm from "./components/InstructionForm/UpdateInstructionForm";

import { genMachUpdatePath, genAddInstPath, genUpdateInstPath, genMachinePath } from "./constants/constants";

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
          <Route path={genMachinePath("new")}>
            <CreateMachineForm />
          </Route>
          <Route exact path={genMachinePath()}>
            <TuringMachinePage />
          </Route>
          <Route path={genMachUpdatePath()}>
            <UpdateMachineForm />
          </Route>
          <Route path={genAddInstPath()}>
            <CreateInstructionForm />
          </Route>
          <Route path={genUpdateInstPath()}>
            <UpdateInstructionForm />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
