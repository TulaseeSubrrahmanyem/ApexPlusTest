Here's an updated version of the README.md file, including the additional features and actions you described:

---

# Vehicle Simulation Application

This is a React.js application that allows users to create, display, update, and delete scenarios and vehicles. The application includes features for simulation control, error handling, and toast notifications.

## Features

- Create, display, update, and delete scenarios and vehicles
- Start and stop simulation to visualize vehicle movements
- Error handling and toast notifications for input validation and success/error messages
- Sidebar navigation for easy access to scenarios and simulation controls

## Technologies Used

- React.js
- json-server
- @emotion/styled
- @fortawesome/fontawesome-svg-core
- @fortawesome/free-solid-svg-icons
- @fortawesome/react-fontawesome
- @mui/material
- @mui/x-charts
- axios
- react-router-dom
- react-select
- react-toastify

## Prerequisites

- Node.js and npm installed
- Access to a terminal or command prompt

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone <repository_url>
   ```

2. Navigate to the project directory:

   ```bash
   cd vehicle-simulation-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start json-server:

   ```bash
   npm run server
   ```

5. Start the application:

   ```bash
   npm start
   ```

## Usage

1. After starting the application, open a web browser and navigate to [http://localhost:3000](http://localhost:3000).
2. Use the sidebar to navigate between scenarios and simulation controls.
3. Create, update, or delete scenarios and vehicles as needed.
4. Start and stop the simulation to observe vehicle movements based on scenario parameters.
5. Use error handling and toast notifications for input validation and success/error messages.

## Additional Features

- **Edit and Delete Options**: On the home page, users can edit and delete vehicles. Error handling and toast notifications are provided for input validation and success/error messages. There's also a "Go Back" button to reset input values.
- **Scenario Management**: The "All Scenarios" tab displays all available scenarios. Users can edit and delete specific scenarios, delete all scenarios with one click, and add new scenarios.
- **Add Vehicle Page**: Users can create vehicles using scenario type, position (X and Y), speed, vehicle name, and direction. Error handling and toast notifications are provided for input validation and success/error messages. There's also a "Go Back" button to reset input values.
- **Add Scenario :Users can add new scenarios through a dedicated page, inputting a scenario name and its duration in seconds. Input validation ensures the scenario name isn't empty, and the time is a positive integer. Toast notifications provide feedback on successful or erroneous scenario additions. The page offers buttons to submit the new scenario, reset input values, and return to the previous page.
## Deployment

The application can be deployed to any platform such as  Netlify and render for backend . Follow the platform-specific deployment instructions to deploy the application.

This is the project link https://apextest.netlify.app/ with the actual URL of your GitHub repository. This way, users can easily access your repository to clone the project. Let me know if you need further assistance!
## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.



---



