import registerModel  from "../models/registrations.js";

export const getRegisteredUsersForEvent = async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const registeredUsers = await registerModel
      .find({ eventid: eventId })
      .select("username role");

    res.status(200).json({ success: true, data: registeredUsers });
  } catch (error) {
    console.error("Error fetching registered users:", error);
    res.status(500).json({ success: false, message: "Error fetching registered users" });
  }
};
