document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id"); // Get event ID from URL

  if (!eventId) {
    alert("Event ID not found.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/events/get-event/${eventId}`
    ); // Adjust URL if necessary
    const data = await response.json();

    if (data.success) {
      // Populate event details
      document.getElementById("eventName").innerText = data.event.eventname;
      document.getElementById("hostName").innerText = data.event.adminusername;
      document.getElementById("eventType").innerText = data.event.type;
      document.getElementById("eventDate").innerText = new Date(
        data.event.datetimeStart
      ).toLocaleDateString();
      document.getElementById("eventTime").innerText = `${new Date(
        data.event.datetimeStart
      ).toLocaleTimeString()} - ${new Date(
        data.event.datetimeEnd
      ).toLocaleTimeString()}`;
      document.getElementById("eventDescription").innerText =
        data.event.description;

      // Set the href for the register link
      const registerLink = document.getElementById("registerLink");
      registerLink.href = `../eventRegistering/?id=${eventId}`;

      // Check if the user is already registered
      const token = localStorage.getItem("token");
      let username = "";

      if (token) {
        try {
          const decodedToken = jwt_decode(token); // Ensure jwt_decode is included
          username = decodedToken.username;

          // Check registration status
          const registrationCheckResponse = await fetch(
            `http://localhost:3000/check-registration?eventId=${eventId}&username=${username}`
          );

          if (!registrationCheckResponse.ok) {
            throw new Error(
              `HTTP error! status: ${registrationCheckResponse.status}`
            );
          }

          const registrationCheckData = await registrationCheckResponse.json();

          if (registrationCheckData.isRegistered) {
            // User is already registered
            const registerButton = document.getElementById("registerButton");
            registerButton.disabled = true; // Disable the button
            registerButton.innerText = "Already Registered"; // Change button text
          } else {
            // Admin cannot register for their own event
            if (username === data.event.adminusername) {
              const registerButton = document.getElementById("registerButton");
              registerButton.disabled = true; // Disable the button
              registerButton.innerText = "Admin Cannot Register"; // Change button text
            } else {
              // Registration time logic
              const currentTime = new Date();
              const eventStartTime = new Date(data.event.datetimeStart);

              // Check if the current time is within 5 minutes before the start time
              const fiveMinutesBeforeStart = new Date(
                eventStartTime.getTime() - 5 * 60 * 1000
              );

              // Disable the button if the current time is between start and end time or too close to start
              const registerButton = document.getElementById("registerButton");
              if (
                currentTime >= eventStartTime ||
                currentTime >= fiveMinutesBeforeStart
              ) {
                registerButton.disabled = true; // Disable the registration button
                registerButton.innerText = "Registration time completed"; // Change button text
              }
            }
          }
        } catch (error) {
          console.error("Error checking registration:", error);
        }
      }
    } else {
      console.error("Failed to fetch event details:", data.message);
    }
  } catch (error) {
    console.error("Error fetching event details:", error);
  }
});
