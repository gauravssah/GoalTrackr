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
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true
  })
);
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

app.get("/", (req, res) => {
  res.send("GoalTrackr API is live");
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "GoalTrackr API healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api", resourceRoutes);
app.use(errorHandler);

module.exports = app;
