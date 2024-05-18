import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'
const Sidebar = () => {
  return (
    <div className="sidebar">
    
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to='/AddScenario'>Add Scenario</Link></li>
        <li><Link to="/AllScenarioList">All Scenarios</Link></li>
        <li><Link to="/AddVehicle">Add Vehicles</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;