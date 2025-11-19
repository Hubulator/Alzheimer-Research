// Remove the problematic import
// import data from "./data/ControlSraRunTable.json" assert { type: "json" };

// Use the CommonJS require() syntax for JSON
import express from "express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const data = require("./data/ControlSraRunTable.json");

const app = express();
app.use(express.static("public"));

const PORT = 3000;

// GET
app.get("/brains", (request, response) => {
  response.json(data);
});

// get with certain id

app.get("/brains/:id", (request, response) => {
  return "no";
});n       

//POST
app.post("/create", (request, response) => {
  response.send("This is a POST request at /create");
});

//PUT
app.put("/edit", (request, response) => {
  response.send("This is a PUT request at /edit");
});

//DELETE
app.delete("/delete", (request, response) => {
  response.send("This is a DELETE request at /delete");
});

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}!`);
});
