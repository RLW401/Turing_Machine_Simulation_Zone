// root/react-app/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useModal } from "../../context/Modal";
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }){
	const { closeModal, setModalContent, onModalClose, setOnModalClose } = useModal();
	const sessionUser = useSelector(state => state.session.user);

	const homeLink = (

		<div className="home-link">
			<NavLink exact to="/" >
				<h2 id="zone-heading">Turing Machine Simulation Zone</h2>
			</NavLink>
	  	</div>
	  );

	  let sessionLinks;
	  if (sessionUser) {
		sessionLinks = (
		  <div className='session-links'>
			<NavLink className='create-tm' to="/turing-machines/new">Create a new Turing Machine</NavLink>
			<div className='profile-button'>
				<ProfileButton user={sessionUser} />
			</div>
		  </div>
		);
	  } else {
		sessionLinks = (
		  <div className='session-links'>

			<button className="login" onClick={(e) => {
				if (onModalClose) setOnModalClose(onModalClose)
				setModalContent(<LoginFormModal closeModal={closeModal}/>)}}
			>Log In</button>

		<button className="signup" onClick={(e) => {
			if (onModalClose) setOnModalClose(onModalClose)
			setModalContent(<SignupFormModal closeModal={closeModal}/>)}}
		>Sign Up</button>
		  </div>
		);
	  }

	  const topBar = (
		<div className='top-bar'>
		  {homeLink}
		  {sessionLinks}
		</div>
	  );

	  const sideBar = (
		<div className='side-bar'>
		  <p>about</p>
		  <p>sample machines</p>
		  <p>my machines</p>
		</div>
	  );

	  return (
		<>
		  {(isLoaded && (
			<>
				{topBar}
				{sideBar}
			</>
			))}
		</>
	  );

}

export default Navigation;
