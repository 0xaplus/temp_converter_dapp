const { ethers } = require("ethers");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL ; 
console.log("HTTP rollup_server url is " + rollup_server);

function hex2Object(hex) {
  const utf8String = ethers.toUtf8String(hex);

  return JSON.parse(utf8String);
}

function obj2Hex(obj) {
  const jsonString = JSON.stringify(obj);

  const hexString = ethers.hexlify(ethers.toUtf8Bytes(jsonString));

  return hexString;
}

function isNumeric(num) {
  return !isNaN(num)
}

function toCelsius(temperature, scale) {
  if (scale === 'F') {
    return (temperature - 32) * 5 / 9;
  } else if (scale === 'K') {
    return temperature - 273.15;
  }

  return temperature;
}

function toFahrenheit(temperature, scale) {
  if (scale === 'C') {
    return (temperature * 9 / 5) + 32;
  } else if (scale === 'K') {
    return (temperature - 273.15) * 9 / 5 + 32;
  }
  return temperature; // If the input is already in Fahrenheit
}

function toKelvin(temperature, scale) {
  if (scale === 'C') {
    return temperature + 273.15;
  } else if (scale === 'F') {
    return (temperature - 32) * 5 / 9 + 273.15;
  }
  return temperature; // If the input is already in Kelvin
}

function convertTemperature(temperature, fromScale, toScale) {
  if (fromScale === toScale) {
    return temperature; // No conversion needed if scales are the same
  }

  let celsiusTemp;

  // First, convert to Celsius as an intermediate step
  if (fromScale === 'C') {
    celsiusTemp = temperature;
  } else if (fromScale === 'F') {
    celsiusTemp = toCelsius(temperature, 'F');
  } else if (fromScale === 'K') {
    celsiusTemp = toCelsius(temperature, 'K');
  }

  // Then, convert from Celsius to the desired scale
  if (toScale === 'C') {
    return celsiusTemp;
  } else if (toScale === 'F') {
    return toFahrenheit(celsiusTemp, 'C');
  } else if (toScale === 'K') {
    return toKelvin(celsiusTemp, 'C');
  }
}

let users = []
let total_operations = 0;

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));

  const metadata = data['metadata']
  const sender = metadata['msg_sender']
  const payload = data['payload']

  let converter_input = hex2Object(payload)

  if (isNumeric(sentence)) {
    const report_req = await fetch(rollup_server + "/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: obj2Hex("Object is not in hex format") }),
    });

    return "reject"
  }

  users.push(sender)
  total_operations += 1

  const converter_output = convertTemperature(converter_input.temperature, converter_input.fromScale, converter_input.toScale)

  const notice_req = await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: obj2Hex(converter_output) }),
  });
  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));

  const payload = data['payload']
  const route = hex2str(payload)

  let responseObject = {}
  if (route === "list") {
    responseObject = JSON.stringify({ users })
  } else if (route === "total") {
    responseObject = JSON.stringify({ total_operations })
  } else {
    responseObject = "route not implemented"
  }

  const report_req = await fetch(rollup_server + "/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: str2hex(responseObject) }),
  });

  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
