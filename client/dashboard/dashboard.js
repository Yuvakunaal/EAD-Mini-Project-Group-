document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  let username = "";

  if (token) {
    try {
      const decodedToken = jwt_decode(token);
      username = decodedToken.username;

      const response = await fetch(
        `http://localhost:3000/dashboard/${username}`
      );
      const data = await response.json();

      if (data.success) {
        document.querySelector(".admin-count").innerText =
          data.counts.adminEventsCount;
        document.querySelector(".organizer-count").innerText =
          data.counts.organizerCount;
        document.querySelector(".participant-count").innerText =
          data.counts.participantCount;

        const adminTableBody = document.querySelector(
          ".admin-events-table tbody"
        );
        if (data.adminEvents.length === 0) {
          adminTableBody.innerHTML =
            "<tr><td colspan='4'>No events found.</td></tr>";
        } else {
          data.adminEvents.forEach((event) => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${event.eventname}</td>
              <td>${new Date(event.datetimeStart).toLocaleDateString()}</td>
              <td>${event.participantsCount}</td>
              <td><a href="../dashboardAdminTable/?eventId=${
                event._id
              }">View Registrants</a></td>
              <td><button class='send-link-btn' onclick="sendMeetLink('${
                event._id
              }')">Send Link</button></td>
            `;
            adminTableBody.appendChild(row);
          });
        }

        // Handle organizer events
        const organizerTableBody = document.querySelector(
          ".organizer-events-table tbody"
        );
        if (data.organizerEvents.length === 0) {
          organizerTableBody.innerHTML =
            "<tr><td colspan='4'>No events organized.</td></tr>";
        } else {
          data.organizerEvents.forEach((registration) => {
            const event = registration.eventid;
            const row = document.createElement("tr");
            const meetLink = event?.meetlink ?? ""; // Default to empty string if not available
            row.innerHTML = `
              <td>${event?.eventname ?? "N/A"}</td>
              <td>${
                event?.datetimeStart
                  ? new Date(event.datetimeStart).toLocaleDateString()
                  : "N/A"
              }</td>
              <td><a href="../profileView/?username=${
                event?.adminusername ?? "N/A"
              }">${event?.adminusername ?? "N/A"}</a></td>
              <td>
                ${
                  meetLink
                    ? `<a href="${meetLink}" target='_blank'>Link</a>`
                    : "<span style='color: gray;'>Link not available</span>"
                }
              </td>
            `;
            organizerTableBody.appendChild(row);
          });
        }

        // Handle participant events
        const participantTableBody = document.querySelector(
          ".participant-events-table tbody"
        );
        if (data.participantEvents.length === 0) {
          participantTableBody.innerHTML =
            "<tr><td colspan='4'>No events participated.</td></tr>";
        } else {
          data.participantEvents.forEach((registration) => {
            const event = registration.eventid;
            const row = document.createElement("tr");
            const meetLink = event?.meetlink ?? ""; // Default to empty string if not available
            row.innerHTML = `
              <td>${event?.eventname ?? "N/A"}</td>
              <td>${
                event?.datetimeStart
                  ? new Date(event.datetimeStart).toLocaleDateString()
                  : "N/A"
              }</td>
              <td><a href="../profileView/?username=${
                event?.adminusername ?? "N/A"
              }">${event?.adminusername ?? "N/A"}</a></td>
              <td>
                ${
                  meetLink
                    ? `<a href="${meetLink}" target='_blank'>Link</a>`
                    : "<span style='color: gray;'>Link not available</span>"
                }
              </td>
            `;
            participantTableBody.appendChild(row);
          });
        }
      } else {
        console.error("Error in data:", data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  } else {
    alert("You need to log in to view the dashboard.");
    window.location.href = "../login";
  }
});

async function sendMeetLink(eventId) {
  const meetlink = prompt("Enter meet URL:");
  if (!meetlink) {
    alert("Meet link cannot be empty.");
    return;
  }
  const meetLinkPattern =
    /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/;
  if (!meetLinkPattern.test(meetlink)) {
    alert(
      "Invalid meet link. Please use the correct format: https://meet.google.com/xxx-xxxx-xxx."
    );
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/events/${eventId}/meetlink`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meetlink }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Error updating meet link.";
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = "Received an unexpected response from the server.";
      }
      alert(`Error: ${errorMessage}`);
      return;
    }

    alert("Meet link updated successfully!");
  } catch (error) {
    alert("An error occurred while updating the meet link.");
    console.error("Fetch error:", error);
  }
}
