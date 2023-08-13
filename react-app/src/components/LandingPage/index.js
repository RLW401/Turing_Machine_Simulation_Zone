// root/react-app/src/components/LandingPage/index.js
import React, { useEffect, useState } from "react";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { aboutWebzone } from "../../constants/constants";
import "./landingPage.css"

const LandingPage = () => {

    return (
        <div className="landing-page">
            <h2>About this Webzone</h2>
            <p>{aboutWebzone}</p>
        </div>
    );

};

export default LandingPage;
