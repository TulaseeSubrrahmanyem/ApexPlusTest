import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import Select from 'react-select';

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#363836',
    color: 'white',
    padding: '5px 10px',
    border: '1px solid #0c7ce6',
    outline: 'none',
    height:"45px",
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
   
    padding: "10px",
    backgroundColor: '#363836',
    '&:hover': {
      backgroundColor: state.isSelected ? '#0c7ce6' : 'lightgray',
      color: state.isSelected ? "white" : 'black',
    }
  }),
  placeholder: (provided) => ({
    ...provided,
    marginTop: '-20px',
    color: 'white', // Placeholder text color
  }),
  singleValue: (provided) => ({
    ...provided,
    marginTop:"-20px",
    color: 'white',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: '#0c7ce6',
    marginTop:"-20px",
    '&:hover': {
      color: '#0c7ce6'
    }
  }),
  indicatorSeparator: () => ({
    display: 'none' // This will remove the vertical line
  })
};

const AddOrUpdateVehicle = () => {

  const apiUrl = import.meta.env.VITE_REACT_APP_API_KEY || import.meta.env.VITE_REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const { mode = 'create', vehicleData, selectedScenarioId, scenarioToAdd } = location.state || {};

  const [vehicle, setVehicle] = useState({
    name: '',
    position: { x: '', y: '' },
    direction: '',
    speed: ''
  });
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await axios.get(`${apiUrl}/scenarios`);
        setScenarios(response.data);

        let defaultScenario = null;
        if (response.data.length > 0) {
          if (mode === 'create') {
            defaultScenario = response.data[0];
          } else if (mode === 'createAnother' && scenarioToAdd) {
            defaultScenario = scenarioToAdd;
            setVehicle({
              name: '',
              position: { x: '', y: '' },
              direction: '',
              speed: ''
            });
          } else if (mode === 'update' && vehicleData) {
            defaultScenario = response.data.find(scenario => scenario.id === vehicleData.scenarioId);
            setVehicle({
              name: vehicleData.name || '',
              position: vehicleData.position || { x: '', y: '' },
              direction: vehicleData.direction || '',
              speed: vehicleData.speed || '',
              id: vehicleData.id
            });
          }
        }
        setSelectedScenario(defaultScenario ? { value: defaultScenario, label: defaultScenario.name } : null);
        setSelectedDirection(vehicle.direction ? { value: vehicle.direction, label: vehicle.direction } : null);
        setVehicle(prevState => ({
          ...prevState,
          scenarioId: prevState.scenarioId || (defaultScenario ? defaultScenario.id : '')
        }));
      } catch (error) {
        console.error('Error fetching scenarios:', error);
      }
    };

    fetchScenarios();
  }, [mode, vehicleData, selectedScenarioId, scenarioToAdd]);

  const handleGoBack = () => {
    if (mode === 'update'){
      navigate('/AllScenarioList');
    }
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'position.x' || name === 'position.y') {
      setVehicle(prevState => ({
        ...prevState,
        position: {
          ...prevState.position,
          [name.split('.')[1]]: value
        }
      }));
    } else {
      setVehicle(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleScenarioChange = (selectedOption) => {
    setSelectedScenario(selectedOption);
    setVehicle(prevState => ({
      ...prevState,
      scenarioId: selectedOption.value.id
    }));
  };

  const handleDirectionChange = (selectedOption) => {
    setSelectedDirection(selectedOption);
    setVehicle(prevState => ({
      ...prevState,
      direction: selectedOption.value
    }));
  };

  const validate = () => {
    let validationErrors = {};
    const maxPositionX = 980;
    const maxPositionY = 400;

    if (!vehicle.scenarioId) validationErrors.scenarioId = 'Scenario ID is required';
    if (!vehicle.name) validationErrors.name = 'Vehicle name is required';
    if (!vehicle.speed) validationErrors.speed = 'Speed is required';
    if (!vehicle.position.x) validationErrors.positionX = 'Position X is required';
    if (!vehicle.position.y) validationErrors.positionY = 'Position Y is required';
    if (!vehicle.direction) validationErrors.direction = 'Direction is required';

    if (vehicle.position.x && (isNaN(vehicle.position.x) || vehicle.position.x > maxPositionX)) {
      validationErrors.positionX = `Position X must be a number and less than ${maxPositionX}`;
    }
    if (vehicle.position.y && (isNaN(vehicle.position.y) || vehicle.position.y > maxPositionY)) {
      validationErrors.positionY = `Position Y must be a number and less than ${maxPositionY}`;
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
     // console.log('Vehicle data before submit:', vehicle);

      const scenarioId = vehicle.scenarioId;
      let url1 = `${apiUrl}/scenarios/${scenarioId}/vehicles`;
      let response;

      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (mode === 'create' || mode === 'createAnother') {
        response = await axios.post(url1, vehicle, config);
        toast.success('Vehicle created successfully');
      } else if (mode === 'update' && vehicle.id) {
        const scenarioExists = scenarios.some(scenario => scenario.id == scenarioId);
        if (!scenarioExists) {
          console.error('Scenario with the given ID does not exist:', scenarioId);
          return;
        }
        let url2 = `${apiUrl}/scenarios/${scenarioId}/vehicles/${vehicle.id}`;
        response = await axios.put(url2, vehicle, config);
        toast.success('Vehicle updated successfully');
      }

      if (response && response.data) {
       // console.log('Response data:', response.data);
      }

      if (mode === 'update') {
        // navigate('/');
      } else {
        // Reset form fields except for scenarioId
        setVehicle(prevState => ({
          ...prevState,
          name: '',
          position: { x: '', y: '' },
          direction: '',
          speed: ''
        }));
        setErrors({}); // Clear errors
      }
    } catch (error) {
      console.error('Error submitting vehicle:', error);
      if (error.response) {
        console.error('Server responded with error:', error.response.data);
        toast.error('An error occurred. Please try again later.',error.response.data, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
      });
      } else if (error.request) {
        console.error('No response received from server:', error.request);
        toast.error('An error occurred. Please try again later.',error.request, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
      });
      } else {
        console.error('Error setting up the request:', error.message);
        toast.error('An error occurred. Please try again later.',error.message, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
      });
      }
    }
  };

  return (
    <>
      <div className='AddVehicle'>
        <h2>{mode === 'create' || mode === 'createAnother' ? 'Add Vehicle' : 'Update Vehicle'}</h2>
        <form onSubmit={handleSubmit}>
          <div className='formContainer1'>
            <div className='formSubContainer'>
              <div className="form-group" style={{marginTop:"-5px"}}>
                <label>Scenario List</label>
                <Select
                  className="selectContainer"
                  styles={customStyles}
                  onChange={handleScenarioChange}
                  value={selectedScenario}
                  options={scenarios.map((scenario) => ({
                    value: scenario,
                    label: scenario.name,
                  }))}
                  isDisabled={mode === 'update'}
                />
                {errors.scenarioId && <div className='error-container'><p className="error">{errors.scenarioId}</p></div>}
              </div>
              <div className="form-group">
                <label>
                  Vehicle Name
                  <input type="text" name="name" value={vehicle.name} onChange={handleChange} className={errors.name ? 'error-input' : ''} />
                  </label>
                  {errors.name && <div className='error-container'><p className="error">{errors.name}</p></div>}
                </div>
                <div className="form-group">
                  <label>
                    Speed
                    <input type="text" name="speed" value={vehicle.speed} onChange={handleChange} className={errors.speed ? 'error-input' : ''} />
                  </label>
                  {errors.speed && <div className='error-container'><p className="error">{errors.speed}</p></div>}
                </div>
              </div>
  
              <div className='formSubContainer'>
                <div className="form-group">
                  <label>
                    Position X
                    <input type="text" name="position.x" value={vehicle.position.x} onChange={handleChange} className={errors.positionX ? 'error-input' : ''} />
                  </label>
                  {errors.positionX && <div className='error-container'><p className="error">{errors.positionX}</p></div>}
                </div>
                <div className="form-group">
                  <label>
                    Position Y
                    <input type="text" name="position.y" value={vehicle.position.y} onChange={handleChange} className={errors.positionY ? 'error-input' : ''} />
                  </label>
                  {errors.positionY && <div className='error-container'> <p className="error">{errors.positionY}</p></div>}
                </div>
                <div className="form-group"  style={{marginTop:"-5px"}}>
                  <label>Direction</label>
                  <Select
                    className="selectContainer"                   
                    styles={customStyles}
                    onChange={handleDirectionChange}
                    value={selectedDirection}
                    options={[
                      { value: "Towards", label: "Towards" },
                      { value: "Backwards", label: "Backwards" },
                      { value: "Upwards", label: "Upwards" },
                      { value: "Downwards", label: "Downwards" }
                    ]}
                  />
                  {errors.direction && <div className='error-container'><p className="error">{errors.direction}</p></div>}
                </div>
              </div>
            </div>
  
            <div className='btns-container'>
              <button type="submit">{mode === 'create' || mode === 'createAnother' ? 'Add' : 'Update'}</button>
              <button type="reset" className='resetBtn' onClick={() => setVehicle({ scenarioId: scenarios.length > 0 ? scenarios[0].id : '', name: '', position: { x: '', y: '' }, direction: '', speed: '' })}>Reset</button>
              <button type="button" className='backBtn' onClick={handleGoBack}>Go Back</button>
            </div>
          </form>
        </div>
        <ToastContainer />
      </>
    );
  };
  
  export default AddOrUpdateVehicle;
  
