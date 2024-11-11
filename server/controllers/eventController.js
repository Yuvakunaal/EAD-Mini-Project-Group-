import eventModel from "../models/events.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createEvent = async (req, res) => {
  try {
    const {
      adminusername,
      eventname,
      type,
      datetimeStart,
      datetimeEnd,
      description,
      posterlink,
      meetlink,
    } = req.body;

    const newEvent = new eventModel({
      adminusername,
      eventname,
      type,
      datetimeStart,
      datetimeEnd,
      description,
      posterlink,
      meetlink,
    });
    const savedEvent = await newEvent.save();

    if (savedEvent) {
      res.json({
        success: true,
        message: "Event created successfully",
        event: savedEvent,
      });
    } else {
      res.json({ success: false, message: "Failed to create event" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await eventModel.find({});
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await eventModel.findById(eventId);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found." });
    }

    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const updateMeetLink = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { meetlink } = req.body;
    console.log("Request body:", req.body);
    console.log("Meet link received:", meetlink);

    const updatedEvent = await eventModel.findByIdAndUpdate(
      eventId,
      { meetlink },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    res.json({
      success: true,
      message: "Meet link updated successfully.",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};

export const getUpcomingEvents = async (req, res) => {
    try {
        const now = new Date();
        const events = await eventModel.find({ datetimeStart: { $gte: now } }).sort("datetimeStart").limit(10);
        res.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Error fetching events" });
    }
};
