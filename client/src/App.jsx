import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AllScenarios from './components/AllScenarios';
import AddScenario from './components/AddScenario';
import AddVehicle from './components/AddVehicle/index.jsx';
import './App.css'
import Home from './components/Home';
import Sidebar from './components/Slidebar';
 import UpdateScenario from './components/EditScenario';
 import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

// Add the edit icon to the library for easy reference
library.add(faEdit);


const App = () => {
  return (
    <Router>
      <div className="app">
        <Sidebar /> {/* Corrected the component name here */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/AllScenarioList" element={<AllScenarios />} />
            <Route path="/AddScenario" element={<AddScenario />} />
            <Route path="/AddVehicle" element={<AddVehicle />} />
            <Route path="/scenarios/:id/vehicles" element={<AddVehicle />} />
            <Route path="/scenarios/:scenarioId/vehicles/:vehicleId" element={<AddVehicle />} />
            <Route path='/UpdateScenario/:id' element={<UpdateScenario/>}/>
          </Routes>
       
        </div>
      </div>
 
    </Router>
  );
};

export default App;
