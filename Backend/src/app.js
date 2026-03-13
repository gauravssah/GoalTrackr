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
const connectDB = require("./config/db");

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  try {
    const { hostname } = new URL(origin);

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return true;
    }

    // Allow Vercel preview and production frontends without editing env vars every deploy.
    if (hostname.endsWith(".vercel.app")) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
}

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
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
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});
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
