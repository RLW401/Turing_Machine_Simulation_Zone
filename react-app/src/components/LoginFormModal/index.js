// root/react-app/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import "./LoginForm.css";

function LoginFormModal({closeModal}) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const demoEmail = "demo@aa.io";
  const demoPassword = "password";



  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
        closeModal()
    }
  };

  const loginDemo = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(demoEmail, demoPassword));
    if (data) {
      setErrors(data);
    } else {
        closeModal()
    }
  };

  const loginForm = (
    <form className="login-form" onSubmit={handleSubmit}>
    <h1>Log In</h1>
    <ul>
      {errors.map((error, idx) => (
        <li key={idx}>{error}</li>
      ))}
    </ul>
    <label>
      Email
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </label>
    <label>
      Password
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </label>
    <button type="submit">Log In</button>
    <button className="demo-login"
    onClick={loginDemo}
    >Demo User</button>
  </form>

  );

  return (
    <>
      {loginForm}
    </>
  );
}

export default LoginFormModal;
