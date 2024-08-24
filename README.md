
# Temperature Converter DApp

This project is a decentralized application (DApp) built using Cartesi that provides a temperature conversion service. The service allows users to convert temperatures between Celsius, Fahrenheit, and Kelvin scales.

## Table of Contents

- [Introduction](#introduction)
- [Setup](#setup)
- [How It Works](#how-it-works)
  - [Temperature Conversion](#temperature-conversion)
  - [Request Handlers](#request-handlers)
  - [Utility Functions](#utility-functions)
- [Running the Application](#running-the-application)
- [API Routes](#api-routes)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This DApp is designed to perform temperature conversions between different scales (Celsius, Fahrenheit, and Kelvin) in a decentralized environment. It uses Cartesi rollups to process the conversion requests and return the results.

## Setup

1. **Install Dependencies**: Ensure you have Node.js and the required packages installed.
   ```bash
   npm install ethers
   ```

2. **Environment Variables**: Set up the `ROLLUP_HTTP_SERVER_URL` environment variable to point to your Cartesi rollup server.

   ```bash
   export ROLLUP_HTTP_SERVER_URL=http://localhost:4000
   ```

## How It Works

### Temperature Conversion

The DApp provides functions to convert temperatures between Celsius, Fahrenheit, and Kelvin:

- **toCelsius**: Converts a temperature to Celsius.
- **toFahrenheit**: Converts a temperature to Fahrenheit.
- **toKelvin**: Converts a temperature to Kelvin.
- **convertTemperature**: Converts a temperature from one scale to another.

### Request Handlers

- **handle_advance**: Handles "advance" state requests by processing a temperature conversion. It accepts a payload containing the temperature, the scale to convert from, and the target scale. The result is returned as a notice.
- **handle_inspect**: Handles "inspect" state requests, which allow inspecting the state of the DApp. It can return a list of users who have made requests or the total number of operations performed.

### Utility Functions

- **hex2Object**: Converts a hexadecimal string to an object.
- **obj2Hex**: Converts an object to a hexadecimal string.
- **isNumeric**: Checks if a value is numeric.

## Running the Application

1. **Start the Cartesi Rollup Server**: Make sure your Cartesi rollup server is running.

2. **Run the DApp**: Use Node.js to run your application.
   ```bash
   node app.js
   ```

The application will listen for requests from the rollup server and process them accordingly.

## API Routes

The following routes are available:

- **/advance_state**: Accepts temperature conversion requests.
- **/inspect_state**: Inspects the current state of the DApp, such as listing users or getting the total number of conversions.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.

---

This `README.md` provides a clear overview of how to set up, run, and understand the DApp, with explanations of key functions and components.