import React from "react";
import "../../../styles/StateData.scss";
import Spreadsheet from "../../../components/SpreadSheet";
const StateData = () => {
    return (
        <div className="StateData page">
            <div className="container">
                <h1 className="content-header">State Data</h1>
                <div className="content-body">
                    <Spreadsheet />
                </div>
            </div>
        </div>
    );
};

export default StateData;
