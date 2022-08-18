const createHandler = require("azure-function-express").createHandler;
const express = require("express");
const { query } = require("express");
const CosmosClient = require("@azure/cosmos").CosmosClient;
require("dotenv").config();
const endpoint = process.env["CosmosEndpoint"];
const key = process.env["CosmosKey"];
const client = new CosmosClient({ endpoint, key });
const database = client.database("demo-db");
const pdlContainer = "demo-container";
const uuid = require("uuid").v4;

// Create express app as usual
const app = express();

app.get("/api/get-text", (req, res) => {
  const container = database.container(pdlContainer);
  return container.items
    .query({ query: "SELECT c.id, c.time, c.participants from c" })
    .fetchAll()
    .then((result) =>
      res.json({
        result,
      })
    );
});

app.post("/api/update-text", (req, res) => {
  const container = database.container(pdlContainer);
  const item = {
    id: uuid(),
    time: new Date(),
    participants: [],
  };
  return container.items.create(item).then((result) => {
    res.send("Time slot created!");
  });
});


// Binds the express app to an Azure Function handler
module.exports = createHandler(app);
