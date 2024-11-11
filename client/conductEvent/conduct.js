let reason = "";
document.addEventListener("DOMContentLoaded", () => {
  const eventform = document.getElementById("eventForm");

  eventform.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate event dates before proceeding
    if (!validateEventDates()) {
      alert(reason);
      return; // If validation fails, stop form submission
    }

    const eventname = document.getElementById("name").value;
    const type = document.getElementById("event-type").value;
    const datetimeStart = document.getElementById("start-time").value;
    const datetimeEnd = document.getElementById("end-time").value;
    const description = document.getElementById("description").value;
    const posterlink = document.getElementById("poster").value;

    let adminusername = "";
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwt_decode(token);
      adminusername = decodedToken.username;
    } else {
      alert("You must be logged in to create an event.");
      window.location.href = "../events"; // Redirect to events page
      return;
    }

    const eventData = {
      adminusername,
      eventname,
      type,
      datetimeStart,
      datetimeEnd,
      description,
      posterlink,
    };

    try {
      const res = await fetch("http://localhost:3000/events/create-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      const data = await res.json();
      if (data.success) {
        alert("Event successfully created!");
        window.location.href = "../events"; // Redirect to events page
      } else {
        alert("Failed to create event: " + data.message);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("There was an error creating the event. Please try again.");
    }
  });
});

function validateEventDates() {
  const startTimeInput = document.getElementById('start-time');
  const endTimeInput = document.getElementById('end-time');
  const startTime = new Date(startTimeInput.value);
  const endTime = new Date(endTimeInput.value);
  const currentTime = new Date();
  const oneHourFromNow = new Date(currentTime.getTime() + 60 * 60 * 1000); // Current time + 1 hour
  const thirtyMinutesFromNow = new Date(currentTime.getTime() + 30 * 60 * 1000); // Current time + 30 minutes

  if (startTime < oneHourFromNow) {
    reason = 'Event start time must be at least 1 hour from now.';
    return false; // Prevent form submission
  }

  // Ensure end time is at least 30 minutes after start time
  const minimumEndTime = new Date(startTime.getTime() + 30 * 60 * 1000); // Start time + 30 minutes
  if (endTime < minimumEndTime) {
    reason = 'Event end time must be at least 30 minutes after the start time.';
    return false; // Prevent form submission
  }

  if (startTime >= endTime) {
    reason = 'Event start time must be before the end time.';
    return false; // Prevent form submission
  }

  return true; // Allow form submission
}
