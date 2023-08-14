// root/react-app/src/components/SignupFormModal/index.js
import React, { useState, useEffect } from "react";
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
	const [submissionAttempt, setSubmissionAttempt] = useState(false);
	const [errors, setErrors] = useState([]);
	const minNameLen = 2;
	const maxNameLen = 31;
	const minPasswordLen = 8;
	const maxPasswordLen = 64;


	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmissionAttempt(true);
		if (errors.length) return;

		setSubmissionAttempt(false);
		const data = await dispatch(signUp(username, firstName, lastName, email, password));
		if (data) {
			setSubmissionAttempt(true);
			setErrors(data);
		} else {
			closeModal();
			window.location.reload(true);
		}
		// if (password === confirmPassword) {
		// 	const data = await dispatch(signUp(username, firstName, lastName, email, password));
		// 	if (data) {
		// 		setSubmissionAttempt(true);
		// 		setErrors(data);
		// 	} else {
		// 		closeModal();
		// 		window.location.reload(true);
		// 	}
		// } else {
		// 	setErrors([
		// 		"Confirm Password field must be the same as the Password field",
		// 	]);
		// }
	};

	const emailCheck = (eAddress) => {
		eAddress = eAddress.split('@');
		if (eAddress.length !== 2) return false;
		const localPart = eAddress[0];
		let domain = eAddress[1];
		if (!localPart.length || !domain.length) return false;
		domain = domain.split('.');
		if (domain.length < 2) return false;
		for (let i = 0; i < domain.length; i++) {
			if (!domain[i].length) return false;
		}
		return true;
	};

	useEffect(() => {
		const newErrors = [];
		if (!emailCheck(email)) {
			newErrors.push("Please enter a valid email address.");
		}
		if (password !== confirmPassword) {
			newErrors.push("Confirm Password field must be the same as the Password field.");
		}
		if ((password.length > maxPasswordLen) || (password.length < minPasswordLen)) {
			newErrors.push(`Password must be between ${minPasswordLen} and ${maxPasswordLen} characters long, inclusive.`);
		}
		const names = {
			"First name": firstName,
			"Last name": lastName,
			"Username": username,
		};
		Object.keys(names).forEach((key) => {
			const value = names[key];
			if ((value.length > maxNameLen) || (value.length < minNameLen)) {
				newErrors.push(`${key} must be between ${minNameLen} and ${maxNameLen} characters long, inclusive.`);
			}
		});
		setErrors(newErrors);
	}, [email, firstName, lastName, username, password, confirmPassword]);

	return (
		<form className="ls-form signup" onSubmit={handleSubmit}>
		<h2>Sign Up</h2>
		{submissionAttempt && <ul>
			{errors.map((error, idx) => (
				<li className="error" key={idx}>{error}</li>
			))}
		</ul>}
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
