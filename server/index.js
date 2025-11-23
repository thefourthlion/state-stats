const express = require("express");
const session = require("express-session");
const passport = require("passport");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3002;
const User = require("./models/auth");
const connectDB = require("./config/mongoose");
require("dotenv").config({ path: "./.env" });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure CORS to accept specific origins
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://stateanalytica.com'
    ];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, 
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
connectDB();
const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy(User.authenticate()));
app.use(
  session({
    secret: process.env.ENCRYPT_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
app.get("/", (req, res) => {
  res.json({ app: "running" });
});
app.listen(PORT, () => {
  console.log("✅ Listening on port " + PORT);
});
app.use("/api/States", require("./routes/States"));
app.use("/api/States", require("./routes/States"));
