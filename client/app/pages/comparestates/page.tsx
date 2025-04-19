import React from "react";
import "../../../styles/CompareStates.scss";
import CompareState from "../../../components/CompareState";
const CompareStates = () => {
    return (
        <div className="CompareStates page">
            <div className="container">
                <h1 className="content-header">Compare States</h1>
                <div className="content-body">
                    <CompareState />
                </div>
            </div>
        </div>
    );
};

export default CompareStates;
