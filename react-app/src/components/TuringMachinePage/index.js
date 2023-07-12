// root/react-app/src/components/TuringMachinePage/index.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { getAuthorizedTMs } from "../../store/turingMachines";
import "./turingMachine.css"

const TuringMachinePage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const machineId = Number(useParams().machineId);

    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        dispatch(getAuthorizedTMs());
    }, [dispatch]);

    return <h2>Placeholder</h2>

};

export default TuringMachinePage;
