import React from "react";
import "../../../styles/MovingCalculator.scss";
import Moving from "../../../components/Moving";
const MovingCalculator = () => {
    return (
        <div className="MovingCalculator page">
            <div className="container">
                <h1 className="content-header">Moving Calculator</h1>
                <div className="content-body">
                    <Moving />
                </div>
            </div>
        </div>
    );
};

export default MovingCalculator;
