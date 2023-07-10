// root/react-app/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { Modal, useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const demoEmail = "demo@aa.io";
  const demoPassword = "password";

  const loginButton = (<button className='log-in'
      onClick={() =>{
      setShowModal(true);
    }}>Log In</button>);

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
      {loginButton}
      {showModal && (
      <Modal>
        {loginForm}
      </Modal>
    )}

    </>
  );
}

export default LoginFormModal;
