// root/react-app/src/components/LandingPage/index.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { getAuthorizedTMs } from "../../store/turingMachines";
import "./landingPage.css"

const LandingPage = () => {
    // const dispatch = useDispatch();
    // const history = useHistory();

    // const [currentUser, setCurrentUser] = useState({});
    // const [machines, setMachines] = useState({});
    // const [instructions, setInstructions] = useState({});

    // const loadCurrentUser = useSelector((state) => {
    //     return state.session.user;
    // });

    // const loadMachines = useSelector((state) => {
    //     return state.turingMachines;
    // });

    // const loadInstructions = useSelector((state) => {
    //     return state.machineInstructions;
    // });

    // useEffect(() => {
    //     const fetchTMs = async () => {
    //         await dispatch(getAuthorizedTMs());
    //     }

    //     fetchTMs();
    //     setCurrentUser(loadCurrentUser);
    // }, [loadCurrentUser, dispatch]);

    // useEffect(() => {
    //     setMachines(loadMachines);
    //     setInstructions(loadInstructions);
    // }, [loadMachines, loadInstructions]);

    // let machineNames = <li key={0}>no machines</li>
    // if (machines.allIds) {
    //     machineNames = machines.allIds.map((mId) => {
    //         const mName = machines.byId[mId].name;
    //         return <li key={mId}>{mName}</li>
    //     });
    // }


    return (
        <div className="landing-page">
            <h2>About this Webzone</h2>
            <p>Eventually there will be something here.</p>
            {/* {machineNames} */}
        </div>
    );

};

export default LandingPage;
