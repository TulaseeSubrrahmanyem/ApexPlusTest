import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const AllScenarios = () => {
  const [scenarios, setScenarios] = useState([]);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_REACT_APP_API_KEY || import.meta.env.VITE_REACT_APP_BASE_URL;
  
  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await axios.get(`${apiUrl}/scenarios`);
        setScenarios(response.data);
      } catch (error) {
        console.error('Error fetching scenarios:', error);
      }
    };

    fetchScenarios();
  }, []);

  const handleEdit = (scenarioId) => {
    const scenarioToEdit = scenarios.find(scenario => scenario.id === scenarioId);
    navigate(`/UpdateScenario/${scenarioId}`, { state: { scenario: scenarioToEdit } });
  };

  const handleAddVehicle = (scenarioId) => {
    const scenarioToAdd = scenarios.find(scenario => scenario.id === scenarioId)
    navigate(`/scenarios/${scenarioId}/vehicles`, { state: { mode: 'createAnother',scenarioToAdd: scenarioToAdd  } });
  };

  const handleDelete = async (scenarioId) => {
    try {
      await axios.delete(`${apiUrl}/scenarios/${scenarioId}`);
      setScenarios(scenarios.filter(scenario => scenario.id !== scenarioId));
      toast.success('Scenario deleted successfully.');
    } catch (error) {
      console.error('Error deleting scenario:', error);
      toast.error('Failed to delete scenario.');
    }
  };

  const handleToNewScenario = () => {
    navigate('/AddScenario');
  };

  const handleToAddVehicle = () => {
    navigate('/AddVehicle');
  };

  const handleToDeleteAll = async () => {
    console.log("AllDelete")
    try {
      const response = await axios.delete(`${apiUrl}/scenariosDeleteAll`);
     
      if (response.status === 204) {
        setScenarios([]);
        toast.success('All scenarios deleted successfully.');
      } else {
        toast.error('Failed to delete scenarios.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while deleting scenarios.');
    }
  };
  

  return (
    <div className='AllScenarios'>
      <ToastContainer />
      <div className='ScenarioBtns'>
        <h2>All Scenarios</h2>
        <div className='AllScenariosBtnContainer'>
          <button type="button" onClick={handleToNewScenario} id='new-scenario'>New Scenario</button>
          <button type="button" onClick={handleToAddVehicle} className='Add-vehicle'>Add Vehicle</button>
          <button type="button" onClick={handleToDeleteAll} className='delete-all'>Delete All</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Scenario ID</th>
            <th>Scenario Name</th>
            <th>Scenario Time</th>
            <th>Number of Vehicles</th>
            <th>Add Vehicle</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((scenario, index) => (
            <tr key={scenario.id}>
              <td>{index + 1}</td>
              <td>{scenario.name}</td>
              <td>{scenario.time}</td>
              <td>{scenario.vehicles ? scenario.vehicles.length : 0}</td>
              <td>
                <button onClick={() => handleAddVehicle(scenario.id)}>
                  <FontAwesomeIcon icon={faCirclePlus} style={{ fontSize: "20px" }} />
                </button>
              </td>
              <td>
                <button onClick={() => handleEdit(scenario.id)}>
                  <FontAwesomeIcon icon={faPen} style={{ fontSize: "20px" }} />
                </button>
              </td>
              <td>
                <button onClick={() => handleDelete(scenario.id)}>
                  <FontAwesomeIcon icon={faTrashCan} style={{ fontSize: "20px" }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllScenarios;
