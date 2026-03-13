const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const authRoutes = require("./routes/auth.routes");
const resourceRoutes = require("./routes/resource.routes");
const errorHandler = require("./middleware/error-handler");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "GoalTrackr API healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api", resourceRoutes);
app.use(errorHandler);

module.exports = app;
