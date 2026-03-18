const express = require("express");
const cors = require("cors");
const sequelize = require("./db/db");
const workflowRoutes = require("./routes/workflowRoutes");
const stepRoutes = require("./routes/stepRoutes");
const ruleRoutes = require("./routes/ruleRoutes");
const executionRoutes = require("./routes/executionRoutes");

const app = express();

app.use(cors());
app.use(express.json());



app.use("/workflows", workflowRoutes);
app.use("/steps", stepRoutes);
app.use("/rules", ruleRoutes);
app.use("/executions", executionRoutes);

sequelize.sync().then(() => {

  console.log("Database synced");

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });

});