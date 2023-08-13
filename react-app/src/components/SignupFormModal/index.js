// root/react-app/src/components/SignupFormModal/index.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signUp } from "../../store/session";
import { useModal } from "../../context/Modal";
import "./SignupForm.css";

function SignupFormModal() {
	const dispatch = useDispatch();
	const { closeModal, setModalContent, onModalClose, setOnModalClose } = useModal();
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState([]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password === confirmPassword) {
			const data = await dispatch(signUp(username, firstName, lastName, email, password));
			if (data) {
				setErrors(data);
			} else {
				closeModal();
				window.location.reload(true);
			}
		} else {
			setErrors([
				"Confirm Password field must be the same as the Password field",
			]);
		}
	};

	return (
		<form className="ls-form" onSubmit={handleSubmit}>
		<h1>Sign Up</h1>
		<ul>
			{errors.map((error, idx) => (
				<li className="error" key={idx}>{error}</li>
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
			First Name
			<input
				type="text"
				value={firstName}
				onChange={(e) => setFirstName(e.target.value)}
				required
			/>
		</label>
		<label>
			Last Name
			<input
				type="text"
				value={lastName}
				onChange={(e) => setLastName(e.target.value)}
				required
			/>
		</label>
		<label>
			Username
			<input
				type="text"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
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
		<label>
			Confirm Password
			<input
				type="password"
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
				required
			/>
		</label>
		<button type="submit">Sign Up</button>
	</form>
	);
}

export default SignupFormModal;
