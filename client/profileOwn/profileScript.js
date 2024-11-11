document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decodedToken = jwt_decode(token);
      const response = await fetch(
        `http://localhost:3000/userProfile/${decodedToken.username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (data.success) {
        document.getElementById("userName").innerText = data.data.username;
        document.getElementById("emailText").innerText = data.data.email;
        document.getElementById("userBio").innerText =
          data.data.bio || "No bio available";
        document.getElementById("userInterests").innerText =
          data.data.interests || "No interests available";

        const profilePicture =
          data.data.profilePicture || "path/to/default-image.jpg";
        document.getElementById("UserProfilePicture").src = profilePicture;

        const datejoin = new Date(data.data.dateJoined);
        document.getElementById(
          "dateJoined"
        ).innerText = `Date Joined: ${datejoin.toLocaleDateString()}`;

        const eventTable = document.getElementById("eventTable");
        data.data.eventActivity.forEach((activity) => {
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
        alert(data.message);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      alert("An error occurred while fetching the profile.");
    }
  } else {
    alert("User not logged in!");
    window.location.href = "../login/";
  }
});
