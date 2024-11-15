document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");

  if (!username) {
    console.error("Username not provided in the URL.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/user/profile/${username}`
    );
    const result = await response.json();

    if (result.success) {
      const user = result.data;
      console.log("User data:", user);

      document.getElementById("userName").textContent = user.username;
      document.getElementById("emailText").textContent = user.email;
      document.getElementById("dateJoinedText").textContent = new Date(
        user.dateJoined
      ).toLocaleDateString();
      document.getElementById("userBio").textContent = user.bio ||  "No bio provided";

      document.getElementById("userInterests").textContent =
        user.interests || "No interests available";

      document.getElementById("profileImage").src = user.profilePicture;

      const eventTable = document.getElementById("eventTable");
      user.eventActivity.forEach((activity) => {
        const row = document.createElement("tr");
        const eventNameCell = document.createElement("td");
        const roleCell = document.createElement("td");

        eventNameCell.textContent = activity.eventName;
        roleCell.textContent = activity.role;

        row.appendChild(eventNameCell);
        row.appendChild(roleCell);
        eventTable.appendChild(row);
      });
    } else {
      console.error("Failed to fetch user profile:", result.message);
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
});
