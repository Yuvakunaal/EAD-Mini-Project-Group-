import eventModel from "../models/events.js";
import registerModel from "../models/registrations.js";

export const getDashboardData = async (req, res) => {
  const username = req.params.username;
  // console.log(username);

  try {
    // Fetch events created by the user as an admin
    const adminEvents = await eventModel.find({ adminusername: username });

    // Fetch counts of participants for each admin event and include admin name
    const adminEventsWithCounts = await Promise.all(
      adminEvents.map(async (event) => {
        const participantCount = await registerModel.countDocuments({ eventid: event._id });
        return {
          ...event.toObject(),
          participantsCount: participantCount,
          adminName: event.adminusername, // Include admin name
        };
      })
    );

    // Fetch events where the user is an organizer and include meetlink
    const organizerEvents = await registerModel
      .find({ username: username, role: "organizer" })
      .populate({
        path: 'eventid',
        select: 'eventname datetimeStart meetlink adminusername' // Include adminusername
      });

    // Fetch events where the user is a participant and include meetlink
    const participantEvents = await registerModel
      .find({ username: username, role: "participant" })
      .populate({
        path: 'eventid',
        select: 'eventname datetimeStart meetlink adminusername' // Include adminusername
      });

    const adminEventsCount = adminEvents.length;
    const organizerCount = organizerEvents.length;
    const participantCount = participantEvents.length;

    res.status(200).json({
      success: true,
      adminEvents: adminEventsWithCounts,
      organizerEvents,
      participantEvents,
      counts: {
        adminEventsCount,
        organizerCount,
        participantCount,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ success: false, message: "Error fetching dashboard data" });
  }
};
