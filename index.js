// --- REQUIRED IMPORTS ---
import express from "express";
import { createRequire } from "module";

// STEP 1: LOAD ENVIRONMENT VARIABLES
// We import the dotenv library and run .config()
// This reads your local .env file and loads variables (like CONTROL_DATA_PATH)
// into the Node.js process.env object, but ONLY when run locally.
import * as dotenv from "dotenv";
dotenv.config();

const require = createRequire(import.meta.url);

// --- DYNAMIC DATA SWITCHING LOGIC ---
let data;
// Get the path to the real data from the environment variables (via process.env)
// This will be undefined when the code is run publicly (e.g., on GitHub's servers).
const REAL_DATA_PATH = process.env.CONTROL_DATA_PATH;

if (REAL_DATA_PATH) {
  // --- LOCAL/DEMO MODE: .env file is present ---
  try {
    // Attempt to load the REAL data file from the hidden .secrets folder
    // This uses the path defined in your .env: .\.secrets\ControlSraRunTable-REAL.json
    data = require(REAL_DATA_PATH);
    console.log(
      `\n*** SERVER MODE: REAL DATA LOADED from ${REAL_DATA_PATH} ***\n`
    );
  } catch (e) {
    // Safety Fallback: If the path is set but the file is missing, use dummy data
    console.error(
      `\nERROR: REAL data path set but failed to load. Using DUMMY data.\n`
    );
    // This loads the public file: ./data/ControlSraRunTable.json
    data = require("./data/ControlSraRunTable.json");
  }
} else {
  // --- PUBLIC/GITHUB MODE: .env file is missing/ignored ---
  // The REAL_DATA_PATH is undefined here. Default to loading the public dummy data file.
  data = require("./data/ControlSraRunTable.json");
  console.log("\n*** SERVER MODE: DUMMY DATA LOADED for Public Demo ***\n");
}
// ------------------------------------

const app = express();
// Middleware to serve static files (index.html, app.js, etc.) from the 'public' folder
app.use(express.static("public"));

const PORT = 3000;

// GET: Returns the loaded data (either REAL or DUMMY) to the frontend app.js
app.get("/brains", (request, response) => {
  response.json(data);
});

// get with certain id (Uses the currently loaded data)
app.get("/brains/:id", (request, response) => {
  // Finds an item in the data array where the 'Run' property matches the ID from the URL
  const itemId = request.params.id;
  const item = data.find((d) => d.Run === itemId);

  if (item) {
    response.json(item);
  } else {
    response.status(404).send("Item not found");
  }
});

//POST, PUT, DELETE routes (these currently only return placeholder messages)
app.post("/create", (request, response) => {
  response.send("This is a POST request at /create");
});

app.put("/edit", (request, response) => {
  response.send("This is a PUT request at /edit");
});

app.delete("/delete", (request, response) => {
  response.send("This is a DELETE request at /delete");
});

// Starts the server
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}!`);
});

// Remove the problematic import
// import data from "./data/ControlSraRunTable.json" assert { type: "json" };

// Use the CommonJS require() syntax for JSON
// import express from "express";
// import { createRequire } from "module";

// const require = createRequire(import.meta.url);
// const data = require("./data/ControlSraRunTable.json");

// const app = express();
// app.use(express.static("public"));

// const PORT = 3000;

// // GET
// app.get("/brains", (request, response) => {
//   response.json(data);
// });

// // get with certain id

// app.get("/brains/:id", (request, response) => {
//   return "no";
// });

// //POST
// app.post("/create", (request, response) => {
//   response.send("This is a POST request at /create");
// });

// //PUT
// app.put("/edit", (request, response) => {
//   response.send("This is a PUT request at /edit");
// });

// //DELETE
// app.delete("/delete", (request, response) => {
//   response.send("This is a DELETE request at /delete");
// });

// app.listen(PORT, () => {
//   console.log(`The server is running on port ${PORT}!`);
// });
