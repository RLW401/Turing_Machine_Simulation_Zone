// root/react-app/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

	const homeLink = (
		<NavLink exact to="/">
			<h2 id="zone-heading">Turing Machine Simulation Zone</h2>
		</NavLink>
	  );

	  let sessionLinks;
	  if (sessionUser) {
		sessionLinks = (
		  <div className='session-links'>
			<div className='profile-button'>
			<ProfileButton user={sessionUser} />
			</div>
			<div className='start-group link top-link'>
			  <NavLink to="/groups/new">Start a new group</NavLink>
			</div>
		  </div>
		);
	  } else {
		sessionLinks = (
		  <div className='session-links'>

			<LoginFormModal />
			<SignupFormModal />
		  </div>
		);
	  }

	  const topBar = (
		<div className='top-bar'>
		  {homeLink}
		  {sessionLinks}
		</div>
	  );

	  return (
		<>
		  {(isLoaded && topBar)}
		</>
	  );

	// return (
	// 	<ul>
	// 		<li>
	// 			<NavLink exact to="/">Home</NavLink>
	// 		</li>
	// 		{isLoaded && (
	// 			<li>
	// 				<ProfileButton user={sessionUser} />
	// 			</li>
	// 		)}
	// 	</ul>
	// );
}

export default Navigation;
