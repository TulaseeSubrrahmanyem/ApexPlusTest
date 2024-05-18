import React, { useState } from 'react';
import './index.css'; // Make sure to create a corresponding CSS file
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const AddScenario = () => {
    const [scenarioName, setScenarioName] = useState('');
    const [scenarioTime, setScenarioTime] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_REACT_APP_API_KEY || import.meta.env.VITE_REACT_APP_BASE_URL;
    // Function to reset form fields and clear errors
    const handleReset = () => {
        setScenarioName('');
        setScenarioTime('');
        setErrors({});
    };

    // Function to navigate back to the home page
    const handleGoBack = () => {
        navigate('/AllScenarioList'); // Navigate to the home page route
    };

    const validateForm = () => {
        const newErrors = {};
        if (!scenarioName) newErrors.scenarioName = 'Scenario name is required.';
        if (!scenarioTime) newErrors.scenarioTime = 'Scenario time is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            try {
                // Send a POST request to the server
                const response = await axios.post(`${apiUrl}/add-scenarios`, { name: scenarioName, time: scenarioTime });
                //console.log(response.data);
                // Reset the form fields after successful submission
                setScenarioName('');
                setScenarioTime('');
                 // Show a success toast
                 toast.success('Scenario added successfully!', {
                    position: 'top-right',
                    autoClose: 3000, // Close after 3 seconds
                    hideProgressBar: true,
                });
            } catch (error) {
                console.error('There was an error!', error);
                // Show an error toast
                toast.error('An error occurred. Please try again later.',error, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            }
        }
    };

    return (
        <div className='AddScenario'>
            <h2>Add Scenario</h2>
            <form noValidate  onSubmit={handleSubmit}>
             <div className='formContainer'>
                <div className='inputContainer'>
                    <div className="form-group">
                        <label>Scenario Name</label>
                        <input
                            type="text"
                            value={scenarioName}
                            placeholder='Test Scenario'
                            onChange={(e) => setScenarioName(e.target.value)}
                            className={errors.scenarioName ? 'error-input' : ''}
                        />
                        {errors.scenarioName &&<div className='error-container'> <div className="error">{errors.scenarioName}</div></div>}
                    </div>
                    <div className="form-group">
                        <label>Scenario Time (seconds)</label>
                        <input
                            type="number"
                            value={scenarioTime}
                            placeholder='10'
                            onChange={(e) => setScenarioTime(e.target.value)}
                            className={errors.scenarioTime ? 'error-input' : ''}
                        />
                        {errors.scenarioTime && <div className='error-container'><div className="error">{errors.scenarioTime}</div></div>}
                    </div>
                </div>
             </div>
             <div className='btns-container'>
                <button type="submit">Add</button>
                <button type="reset" onClick={handleReset}>Reset</button>
                <button type="button" className='backBtn' onClick={handleGoBack}>Go Back</button>
             </div>
               
            </form>
           
               
           <ToastContainer/>
        </div>
    );
};

export default AddScenario;
