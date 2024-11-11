import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import controllers
import { signup, login } from "./controllers/authController.js";
import {
  createEvent,
  getAllEvents,
  getEventById,
  getUpcomingEvents,
  updateMeetLink,
} from "./controllers/eventController.js";
import { postIssue, getIssues } from "./controllers/issueController.js";
import {
  registerEvent,
  checkRegistration,
  getRegistrations,
} from "./controllers/registrationController.js";
import { getDashboardData } from "./controllers/dashboardController.js";
import { getRegisteredUsersForEvent } from "./controllers/dashboardAdminTableController.js";
import { getUserProfile } from "./controllers/userProfileViewController.js";
import { updateProfile } from "./controllers/profileUpdateController.js";
import { authenticateJWT } from "./middleware/auth.js";

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
const mongo_url = process.env.MONGO_URL;

app.get("/", (req, res) => {
  res.send("Welcome to backend!");
});

// Auth routes
app.post("/signup", signup);
app.post("/login", login);

// Profile routes
app.get("/userProfile/:username", authenticateJWT, getUserProfile);
app.put("/updateProfile", authenticateJWT, updateProfile);

// Event routes
app.post("/events/create-event", createEvent);
app.get("/events/get-all", getAllEvents);
app.get("/events/get-event/:id", getEventById);
app.put("/events/:id/meetlink", updateMeetLink);
app.get("/api/upcoming-events",getUpcomingEvents);

// Registration routes
app.post("/register-event", registerEvent);
app.get("/check-registration", checkRegistration);
app.get("/getregistrations", getRegistrations);

// Dashboard route
app.get("/dashboard/:username", getDashboardData);
app.get("/api/events/:eventId/registrations", getRegisteredUsersForEvent);
app.get("/user/profile/:username", getUserProfile);

// Issue route
app.post("/postissues", postIssue);
app.get("/getissues", getIssues);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  mongoose
    .connect(mongo_url)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log(error);
    });
});
