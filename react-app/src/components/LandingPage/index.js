// root/react-app/src/components/LandingPage/index.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { getAuthorizedTMs } from "../../store/turingMachines";
import "./landingPage.css"

const LandingPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [currentUser, setCurrentUser] = useState({});
    const [machines, setMachines] = useState({});

    const loadCurrentUser = useSelector((state) =>{
        return state.session.user;
    });

    useEffect(() => {
        setCurrentUser(loadCurrentUser)
        dispatch(getAuthorizedTMs());
    }, [loadCurrentUser, dispatch]);

    return (
        <div className="landing-page">
            <h2>Placeholder</h2>
        </div>
    );

};

export default LandingPage;
