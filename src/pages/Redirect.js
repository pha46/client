import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Redirect() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/secure/home');
    }, [navigate]);

    return null
}

export default Redirect;