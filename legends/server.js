import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const app = express();

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow requests from your React/Next.js frontend
app.use(cors({
  origin: "http://localhost:3000", // frontend origin
  credentials: true,
}));

// Session middleware
app.use(session({
  secret: "your_secret_key", // change this to something secure
  resave: false,
  saveUninitialized: true,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Check if environment variables are set
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error("❌ Error: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env file");
  console.error("Please create a .env file in the legends directory with:");
  console.error("GOOGLE_CLIENT_ID=your_client_id");
  console.error("GOOGLE_CLIENT_SECRET=your_client_secret");
  process.exit(1);
}

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5001/auth/google/callback", // backend callback
}, (accessToken, refreshToken, profile, done) => {
  // Here you can save the user in a database if needed
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Route to start Google OAuth login
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback route after Google login
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000" }),
  (req, res) => {
    // Redirect back to frontend with user info in query string
    res.redirect(`http://localhost:3000/dashboard?user=${req.user.displayName}`);
  }
);

// Optional: logout route
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:3000");
  });
});

// Simple in-memory user store (replace with database in production)
const users = [];

// Signup endpoint
app.post("/api/signup", (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Create new user (in production, hash the password!)
  const newUser = {
    id: users.length + 1,
    firstName,
    lastName,
    email,
    password, // In production, hash this with bcrypt!
    displayName: `${firstName} ${lastName}`
  };

  users.push(newUser);
  console.log(`✅ New user registered: ${email}`);

  res.json({ 
    success: true, 
    message: "User created successfully",
    user: {
      id: newUser.id,
      email: newUser.email,
      displayName: newUser.displayName
    }
  });
});

// Login endpoint
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Find user
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Create session
  req.login(user, (err) => {
    if (err) {
      return res.status(500).json({ error: "Login failed" });
    }
    res.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName
      }
    });
  });
});

// Start server
const PORT = 5001;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
