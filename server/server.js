const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = './data.json';

const readData = () => {
  const jsonData = fs.readFileSync(DATA_FILE);
  return JSON.parse(jsonData);
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Get all scenarios
app.get('/scenarios', (req, res) => {
  const data = readData();
  res.json(data.scenarios);
});

// Create a new scenario
app.post('/add-scenarios', (req, res) => {
  const data = readData();
  const newScenario = { id: Date.now().toString(), ...req.body,  vehicles: [] };
  data.scenarios.push(newScenario);
  writeData(data);
  res.status(201).json(newScenario);
});

// Update an existing scenario
app.put('/update-scenarios/:id', (req, res) => {
  const data = readData();
  const scenarioIndex = data.scenarios.findIndex(s => s.id === req.params.id);
  if (scenarioIndex >= 0) {
    data.scenarios[scenarioIndex] = { ...data.scenarios[scenarioIndex], ...req.body };
    writeData(data);
    res.json(data.scenarios[scenarioIndex]);
  } else {
    res.status(404).send('Scenario not found');
  }
});

// Delete a scenario
app.delete('/scenarios/:id', (req, res) => {
  const data = readData();
  const scenarioIndex = data.scenarios.findIndex(s => s.id == req.params.id);
  if (scenarioIndex >= 0) {
    data.scenarios.splice(scenarioIndex, 1);
    writeData(data);
    res.status(204).send();
  } else {
    res.status(404).send('Scenario not found');
  }
});


//delete all

app.delete('/scenariosDeleteAll', (req, res) => {
  try {
    const newData = readData();
    newData.scenarios = []; // Clear all scenarios
    writeData(newData);

    // Log the response body before sending
    console.log('Deleted all scenarios:', newData.scenarios);

    res.status(204).send(); // Respond with a 204 (No Content) status
  } catch (error) {
    console.error('Error while deleting scenarios:', error);
    res.status(500).send('Internal server error'); // Handle other errors
  }
});



// Get all vehicles for a specific scenario
app.get('/scenarios/:id/vehicles', (req, res) => {
  const data = readData();
  const scenarioId = req.params.id; // No need to parse to int if it's a string
  const scenario = data.scenarios.find(s => s.id == scenarioId);
  if (scenario) {
    res.json(scenario.vehicles);
  } else {
    res.status(404).send('Scenario not found');
  }
});

// Create a new vehicle in a scenario
app.post('/scenarios/:id/vehicles', (req, res) => {
  const data = readData();
  const scenarioId = req.params.id; // No need to parse to int if it's a string
  const scenarioIndex = data.scenarios.findIndex(s => s.id == scenarioId);
  if (scenarioIndex >= 0) {
    const newVehicle = { id: Date.now().toString(), ...req.body };
    if (!data.scenarios[scenarioIndex].vehicles) {
      data.scenarios[scenarioIndex].vehicles = [];
    }
    data.scenarios[scenarioIndex].vehicles.push(newVehicle);
    writeData(data);
    res.status(201).json(newVehicle);
  } else {
    res.status(404).send('Scenario not found');
  }
});

app.put('/scenarios/:scenarioId/vehicles/:vehicleId', (req, res) => {
  const data = readData();
  console.log('Available scenarios:', data.scenarios); // Debug log
  const scenarioId = req.params.scenarioId;
  console.log('Requested scenarioId:', scenarioId); // Debug log
  // Extract vehicleId from the request parameters
  const vehicleId = req.params.vehicleId;
  console.log('Requested vehicleId:', vehicleId); // Debug log
  const scenarioIndex = data.scenarios.findIndex(s => s.id == scenarioId);
  console.log('Scenario index:', scenarioIndex); // Debug log
  if (scenarioIndex >= 0) {
    // Now vehicleId is defined, so we can use it to find the vehicle
    const vehicleIndex = data.scenarios[scenarioIndex].vehicles.findIndex(v => v.id == vehicleId);
    console.log('Vehicle index:', vehicleIndex); // Debug log
    if (vehicleIndex >= 0) {
      // Update the vehicle with the new data from req.body
      data.scenarios[scenarioIndex].vehicles[vehicleIndex] = { ...data.scenarios[scenarioIndex].vehicles[vehicleIndex], ...req.body };
      writeData(data);
      res.json(data.scenarios[scenarioIndex].vehicles[vehicleIndex]);
    } else {
      res.status(404).send('Vehicle not found');
    }
  } else {
    res.status(404).send('Scenario not found');
  }
});


// Delete a vehicle from a scenario
app.delete('/scenarios/:scenarioId/vehicles/:vehicleId', (req, res) => {
  const data = readData();
  const scenarioId = req.params.scenarioId;
  const vehicleId = req.params.vehicleId;
  const scenarioIndex = data.scenarios.findIndex(s => s.id == scenarioId);
  if (scenarioIndex >= 0) {
    const vehicleIndex = data.scenarios[scenarioIndex].vehicles.findIndex(v => v.id == vehicleId);
    if (vehicleIndex >= 0) {
      data.scenarios[scenarioIndex].vehicles.splice(vehicleIndex, 1);
      writeData(data);
      res.status(204).send();
    } else {
      res.status(404).send('Vehicle not found');
    }
  } else {
    res.status(404).send('Scenario not found');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
