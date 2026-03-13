require("./config/env");
const app = require("./app");
const connectDB = require("./config/db");

const port = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`GoalTrackr API running on port ${port}`);
  });
});
