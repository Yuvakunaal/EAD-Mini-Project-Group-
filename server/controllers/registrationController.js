import registerModel from "../models/registrations.js";
import eventModel from "../models/events.js"; 
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerEvent = async (req, res) => {
  try {
    const { username, role, phno, eventid } = req.body;

    console.log("Registration Data:", req.body);

    const event = await eventModel.findById(eventid);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    if (role === "participant") {
      if (event.participants.includes(username)) {
        return res.status(400).json({ success: false, message: "Already registered as participant." });
      }
      event.participants.push(username);
    } else if (role === "organizer") {
      if (event.organizers.includes(username)) {
        return res.status(400).json({ success: false, message: "Already registered as organizer." });
      }
      event.organizers.push(username);
    } else {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }

    await event.save();

    const registration = new registerModel({ username, role, phno, eventid });
    await registration.save();

    res.json({ success: true, message: "Registration successful!", event });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ success: false, message: "Error during registration.", error: error.message });
  }
};

export const checkRegistration = async (req, res) => {
  const { eventId, username } = req.query;

  try {
    const registration = await registerModel.findOne({
      eventid: eventId,
      username,
    });

    if (registration) {
      return res.json({ isRegistered: true });
    }
    return res.json({ isRegistered: false });
  } catch (error) {
    console.error("Error checking registration:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getRegistrations = async (req, res) => {
  try {
    const registerData = await registerModel.find();
    console.log(registerData);
    res.send(registerData);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: "Error fetching registrations." });
  }
};
