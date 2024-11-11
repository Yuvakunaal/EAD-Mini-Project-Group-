import userModel from "../models/users.js";
import registerModel from "../models/registrations.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const eventActivities = await registerModel
      .find({ username })
      .populate("eventid", "eventname");

    const eventActivity = eventActivities.map((activity) => ({
      eventName: activity.eventid.eventname,
      role: activity.role,
    }));

    res.status(200).json({
      success: true,
      data: {
        username: user.username,
        email: user.email,
        dateJoined: user.datejoined,
        bio: user.bio || "",
        interests: user.interest || "",
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
