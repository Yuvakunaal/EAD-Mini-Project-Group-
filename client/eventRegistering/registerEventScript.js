let eventId; // Declare eventId in a broader scope

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  eventId = params.get("id"); // Assign the value to the outer variable
  const backButton = document.getElementById("navigate-back");
  if (eventId) {
    backButton.href = `../moredetails/?id=${eventId}`;
  } else {
    backButton.href = "../events/"; // Fallback to events page
  }
});

document
  .getElementById("registrationForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const userType = document.querySelector(
      'input[name="userType"]:checked'
    ).value;
    const contactNumber = document.getElementById("contactNumber").value;

    const token = localStorage.getItem("token");
    let name = "";
    if (token) {
      try {
        const decodedToken = jwt_decode(token); // Ensure jwt_decode is included
        name = decodedToken.username;
      } catch (error) {
        alert("Invalid token. Please log in again.");
        window.location.href = "../login";
        return;
      }
    } else {
      alert("You must be logged in to register an event.");
      window.location.href = "../login";
      return;
    }

    // Check if the user is already registered for this event
    try {
      const registrationCheckResponse = await fetch(
        `http://localhost:3000/check-registration?eventId=${eventId}&username=${name}`
      );

      if (!registrationCheckResponse.ok) {
        throw new Error(
          `HTTP error! status: ${registrationCheckResponse.status}`
        );
      }

      const registrationCheckData = await registrationCheckResponse.json();

      if (registrationCheckData.isRegistered) {
        alert("You are already registered for this event.");
        return; // Stop further execution
      }
    } catch (error) {
      console.error("Error checking registration:", error);
      alert("There was an error checking your registration status.");
      return; // Stop further execution
    }

    const registrationData = {
      username: name,
      role: userType,
      phno: contactNumber,
      eventid: eventId, // Use the outer eventId
    };

    try {
      const response = await fetch("http://localhost:3000/register-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        alert("Registration successful!");
        window.location.href = "../events/";
      } else {
        alert("Registration failed: " + data.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("There was an error processing your registration.");
    }
  });