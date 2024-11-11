import userModel from "../models/users.js";
import registerModel from "../models/registrations.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    // Fetch user details based on the username
    const user = await userModel.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Fetch events the user is registered for, along with their roles
    const eventActivities = await registerModel
      .find({ username })
      .populate("eventid", "eventname");

    // Map the fetched event activities to the desired format
    const eventActivity = eventActivities.map((activity) => ({
      eventName: activity.eventid.eventname,
      role: activity.role,
    }));

    // Prepare and send the response with user data and event activity
    res.status(200).json({
      success: true,
      data: {
        username: user.username,
        email: user.email,
        dateJoined: user.datejoined,
        bio: user.bio || "", // Ensure this matches the schema
        interests: user.interest || "", // Ensure this matches the schema
        profilePicture: user.profilePicture,
        eventActivity,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching user profile" });
  }
};
