// root/react-app/src/components/Navigation/index.js
import React, { useEffect, useState } from "react";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { getAuthorizedTMs } from "../../store/turingMachines";
import './Navigation.css';

function Navigation({ isLoaded }){
	const dispatch = useDispatch();
	const history = useHistory();
	const { closeModal, setModalContent, onModalClose, setOnModalClose } = useModal();
	const sessionUser = useSelector(state => state.session.user);

	// const [currentUser, setCurrentUser] = useState(null);
	const [machines, setMachines] = useState({});
	const [instructions, setInstructions] = useState({});
	// const [publicMachines, setPublicMachines] = useState([]);
	// const [userMachines, setUserMachines] = useState([]);
	// const [collabMachines, setCollabMachines] = useState([]);

	let publicMachines = [];
	let userMachines = [];
	let collabMachines = [];

	const loadMachines = useSelector((state) => {
		return state.turingMachines;
	});

	const loadInstructions = useSelector((state) => {
		return state.machineInstructions;
	});

	// useEffect(() => {
	// 	setCurrentUser(sessionUser);
	// }, [sessionUser]);

	useEffect(() => {
		const fetchTMs = async () => {
			await dispatch(getAuthorizedTMs());
		}

		fetchTMs();
		// if (userLoad) fetchTMs();
	}, [sessionUser, dispatch]);

	useEffect(() => {
		setMachines(loadMachines);
		setInstructions(loadInstructions);
	}, [loadMachines, loadInstructions]);


	const homeLink = (

		<div className="home-link">
			<NavLink exact to="/" onClick={() => {
				history.push("/");
				window.location.reload(true);
			}}>
				<h2 id="zone-heading">Turing Machine Simulation Zone</h2>
			</NavLink>
	  	</div>
	);

	let sessionLinks;
	if (sessionUser) {
		sessionLinks = (
			<div className='session-links'>
				<NavLink className='create-tm' to="/turing-machines/new"
					onClick={() => {
						history.push("/turing-machines/new");
						window.location.reload(true);
					}}
				>Create a new Turing Machine</NavLink>
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


	if (machines.allIds && machines.allIds.length) {
		publicMachines = [];
		userMachines = [];
		collabMachines = [];

		machines.allIds.forEach((mId) => {
			const currentMachine = machines.byId[mId]
			if (currentMachine.public) {
				// publicMachines.push(currentMachine);
				// TODO: add working instructions to all public machines
				if (currentMachine.name === "Successor Function") {
					publicMachines.push(currentMachine);
				}
			} else if (sessionUser) {
				if (currentMachine.ownerId === sessionUser.id) {
					userMachines.push(currentMachine);
				} else if (currentMachine.collaboratorId === sessionUser.id) {
					collabMachines.push(currentMachine);
				}
			}
		});
	}

	const sampleMachines = (
		<div className="sample-machines">
			<p>Sample Machines</p>
			{publicMachines.map((machine) => (
				<NavLink className="m-link public" key={machine.id}
					to={`/machines/${machine.id}`}>
						<p>{machine.name}</p>
				</NavLink>
			))}
		</div>
	);

	const myMachines = (
		<div className="my-machines">
			<p>My Machines</p>
			{userMachines.map((machine) => (
				<NavLink className="m-link user" key={machine.id}
					to={`/machines/${machine.id}`}>
						<p>{machine.name}</p>
				</NavLink>
			))}
			<NavLink
			className='create-tm' to="/turing-machines/new"
			onClick={() => {
				history.push("/turing-machines/new");
				window.location.reload(true);
			}}
			>+ Create Machine</NavLink>
		</div>
	);

	const collaboratorMachines = (
		<div className="collaborator-machines">
			<p>collaborator Machines</p>
			{collabMachines.map((machine) => (
				<NavLink className="m-link collaborator" key={machine.id}
					to={`/machines/${machine.id}`}>
						<p>{machine.name}</p>
				</NavLink>
			))}
		</div>
	);

	// TODO: Write What is a Turing Machine page.
	const sideBar = (
		<div className='side-bar'>
			{/* <p>What is a Turing Machine?</p> */}
			{!!publicMachines.length && sampleMachines}
			{!!userMachines.length && myMachines}
			{!!collabMachines.length && collaboratorMachines}
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
