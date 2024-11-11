import issueModel from "../models/issues.js";

// Function to handle issue submission
export const postIssue = async (req, res) => {
    const { username, issue } = req.body;

    try {
        // Create a new issue entry
        const newIssue = new issueModel({
            username,
            issue,
        });

        // Save to database
        await newIssue.save();

        res.status(200).json({ success: true, message: "Issue submitted successfully!" });
    } catch (error) {
        console.error("Error submitting issue:", error);
        res.status(500).json({ success: false, message: "Error submitting issue." });
    }
};

export const getIssues = async (req, res) => {
    const { username } = req.query;
    console.log("Querying issues for username:", username);

    try {
        const issues = await issueModel.find({ username });
        console.log("Retrieved issues:", issues);

        if (issues.length > 0) {
            res.status(200).json({ success: true, issues });
        } else {
            res.status(404).json({ success: true, message: "No issues found for this user." });
        }
    } catch (error) {
        console.error("Error retrieving issues:", error);
        res.status(500).json({ success: false, message: "Error retrieving issues." });
    }
};
