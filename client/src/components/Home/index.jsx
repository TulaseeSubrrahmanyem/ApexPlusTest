import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
// import dotenv from 'dotenv';
// dotenv.config();

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#363836',
    color: 'white',
    padding: '5px 10px',
    border: '1px solid #0c7ce6',
    outline: 'none',
    boxShadow: state.isFocused ? '0 0 0 1px #0c7ce6' : 'none', // Remove the default outline
    '&:hover': {
      borderColor: '#0c7ce6'
    }
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#363836',
    color: 'white',
  }),
  option: (provided, state) => ({
    ...provided,
    borderBottom: '2px solid #000',
    color: "#fff",
    padding:"10px",
    backgroundColor:'#363836',
    '&:hover': {
      backgroundColor: state.isSelected ? '#0c7ce6' : 'lightgray',
      color:state.isSelected ?"white": 'black',
    }
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'white',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: '#0c7ce6',
    '&:hover': {
      color: '#0c7ce6'
    }
  }),
  indicatorSeparator: () => ({
    display: 'none' // This will remove the vertical line
  })
  
  
};


const SimulationGrid = () => {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [simulation, setSimulation] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
 
  const apiUrl = import.meta.env.VITE_REACT_APP_API_KEY || import.meta.env.VITE_REACT_APP_BASE_URL;
  //console.log("api url",apiUrl)
  // Assuming containerWidth and containerHeight are defined
  const containerWidth = 1000; // Replace with actual width
  const containerHeight = 400; // Replace with actual height

  // Function to generate a random color
  const getRandomColor = () => {
    const minColorValue = 0; // Minimum value for each RGB component
    const maxColorValue = 100; // Maximum value for each RGB component

    const getRandomValue = () => Math.floor(Math.random() * (maxColorValue - minColorValue + 1)) + minColorValue;

    const r = getRandomValue();
    const g = getRandomValue();
    const b = getRandomValue();

    return `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await axios.get(`${apiUrl}/scenarios`);
        //  console.log('API Response:', response.data);
        setScenarios(response.data);
        setSelectedScenario(response.data.length > 0 ? { value: response.data[0], label: response.data[0].name } : null);
      } catch (error) {
        console.error('Error fetching scenarios:', error);
      }
    };
    fetchScenarios();
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (selectedScenario) {
        try {
          const response = await axios.get(`${apiUrl}/scenarios/${selectedScenario.value.id}/vehicles`);
          const initialVehicles = response.data.map((vehicle) => ({
            ...vehicle,
            x: parseInt(vehicle.position.x),
            y: parseInt(vehicle.position.y),
            isVisible: true,
            color: getRandomColor(),
          }));
          setVehicles(initialVehicles);
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        }
      }
    };
    fetchVehicles();
  }, [selectedScenario]);

  const updateVehiclePositions = () => {
    setVehicles((currentVehicles) => {
      return currentVehicles.map((vehicle) => {
        let newX = vehicle.x;
        let newY = vehicle.y;
        switch (vehicle.direction) {
          case 'Towards':
            newY -= vehicle.speed;
            if (newY < 0) newY = 0; // Limit movement to the top boundary
            break;
          case 'Backwards':
            newY += vehicle.speed;
            if (newY > containerHeight - 40) newY = containerHeight - 40; // Limit movement to the bottom boundary
            break;
          case 'Upwards':
            newX -= vehicle.speed;
            if (newX < 0) newX = 0; // Limit movement to the left boundary
            break;
          case 'Downwards':
            newX += vehicle.speed;
            if (newX > containerWidth - 40) newX = containerWidth - 40; // Limit movement to the right boundary
            break;
          default:
          // Handle other directions or invalid direction
        }

        const isVisible = newX >= 0 && newY >= 0 && newX <= containerWidth - 40 && newY <= containerHeight - 40;
       // console.log(`Vehicle ${vehicle.id}: x=${newX}, y=${newY}`);
        return { ...vehicle, x: newX, y: newY, isVisible };
      });
    });
  };

  const handleEditVehicle = (vehicleId) => {
    const vehicleToEdit = vehicles.find((vehicle) => vehicle.id === vehicleId);
    navigate('/scenarios/:scenarioId/vehicles/:vehicleId', {
      state: { mode: 'update', vehicleData: vehicleToEdit, selectedScenarioId: vehicleToEdit.scenarioId },
    });
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await axios.delete(`${apiUrl}/scenarios/${selectedScenario.value.id}/vehicles/${vehicleId}`);
      const updatedVehicles = vehicles.filter((vehicle) => vehicle.id !== vehicleId);
      setVehicles(updatedVehicles);
      console.log('Updated vehicles after deletion:', updatedVehicles);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const startSimulation = () => {
    if (!simulation) {
      setSimulation(true);
      const newIntervalId = setInterval(updateVehiclePositions, 1000);
      setIntervalId(newIntervalId);
    }
  };

  const resetVehiclesToInitialPositions = () => {
    setVehicles((currentVehicles) => {
      return currentVehicles.map((vehicle) => ({
        ...vehicle,
        x: vehicle.x,
        y: vehicle.y,
        isVisible: true,
      }));
    });
  };

  const stopSimulation = () => {
    if (simulation) {
      setSimulation(false);
      clearInterval(intervalId);
      resetVehiclesToInitialPositions();
    }
  };

  return (
    <div className="home">
      <div className="controls">
        <label>Scenario</label>
        <Select
          className="selectContainer"
          styles={customStyles}
          onChange={(selectedOption) => setSelectedScenario(selectedOption)}
          value={selectedScenario}
          options={scenarios.map((scenario) => ({
            value: scenario,
            label: scenario.name,
          }))}
        />
      </div>

      {vehicles.length === 0 ? (
        <p>No vehicle data available</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Position X</th>
                <th>Position Y</th>
                <th>Direction</th>
                <th>Speed</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle, index) => (
                <tr key={vehicle.id}>
                  <td>{index + 1}</td>
                  <td>{vehicle.name}</td>
                  <td>{vehicle.x}</td>
                  <td>{vehicle.y}</td>
                  <td>{vehicle.direction}</td>
                  <td>{vehicle.speed}</td>
                  <td>
                    <button onClick={() => handleEditVehicle(vehicle.id)} className="editBtn">
                      <FontAwesomeIcon icon={faPen} style={{ fontSize: '20px' }} />
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDeleteVehicle(vehicle.id)} className="editBtn">
                      <FontAwesomeIcon icon={faTrashAlt} style={{ fontSize: '20px' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <div className="btnContainer">
        <button className="startSimulationBtn" onClick={startSimulation}>
          Start Simulation
        </button>
        <button className="stopSimulationBtn" onClick={stopSimulation}>
          Stop Simulation
        </button>
      </div>
      <div id="grid-container" style={{ position: 'relative', width: containerWidth, height: containerHeight }}>
        {vehicles.map((vehicle, index) => (
          vehicle.isVisible && (
            <div key={vehicle.id} id={`vehicle-${vehicle.id}`} className="vehicle" style={{ position: 'absolute', left: vehicle.x, top: vehicle.y, width: "25px", height: "25px", backgroundColor: vehicle.color ,borderRadius:"50%"}}>
              <p style={{fontSize:"14px",fontWeight:"600",margin:"5px",textAlign:"center",color:"white"}}>{index + 1}</p>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default SimulationGrid;
