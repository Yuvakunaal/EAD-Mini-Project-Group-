document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");

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
          const decodedToken = jwt_decode(token);
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
            const registerButton = document.getElementById("registerButton");
            registerButton.disabled = true;
            registerButton.innerText = "Already Registered";
          } else {
            if (username === data.event.adminusername) {
              const registerButton = document.getElementById("registerButton");
              registerButton.disabled = true;
              registerButton.innerText = "Admin Cannot Register";
            } else {
              const currentTime = new Date();
              const eventStartTime = new Date(data.event.datetimeStart);

              const fiveMinutesBeforeStart = new Date(
                eventStartTime.getTime() - 5 * 60 * 1000
              );

              const registerButton = document.getElementById("registerButton");
              if (
                currentTime >= eventStartTime ||
                currentTime >= fiveMinutesBeforeStart
              ) {
                registerButton.disabled = true;
                registerButton.innerText = "Registration time completed";
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
