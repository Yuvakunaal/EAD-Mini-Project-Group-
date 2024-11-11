import userModel from "../models/users.js";

export const updateProfile = async (req, res) => {
  const { bio, interest, profilePicture } = req.body; // Ensure you're getting the correct fields
  const username = req.user.username; // Assuming you're getting the username from the authenticated token

  try {
    const user = await userModel.findOneAndUpdate(
      { username },
      { bio, interest, profilePicture }, // Ensure you're updating the correct fields
      { new: true } // This option returns the updated document
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
};
