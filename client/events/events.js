document.addEventListener("DOMContentLoaded", async () => {
  const cardsContainer = document.querySelector(".cards");
  const searchInput = document.querySelector(".search input"); // Select the search bar input
  const token = localStorage.getItem("token");
  let adminUsername = "";
  let allEvents = []; // Store all events for filtering purposes

  if (token) {
    const decodedToken = jwt_decode(token);
    adminUsername = decodedToken.username; // Extract the admin username
    console.log("Admin Username: ", adminUsername);
  }

  try {
    const response = await fetch("http://localhost:3000/events/get-all");
    const data = await response.json();

    console.log("Fetched Events: ", data); // Log the fetched events

    if (data.success) {
      allEvents = data.events; // Store events in allEvents array
      displayEvents(allEvents);

      // Add filter event listeners
      document.querySelectorAll(".filter-option a").forEach((option) => {
        option.addEventListener("click", (e) => {
          e.preventDefault();
          const filterText = option.textContent.trim();
          console.log("Selected Filter: ", filterText); // Log the selected filter
          filterEvents(allEvents, filterText);
        });
      });
    } else {
      console.error("Failed to fetch events:", data.message);
    }
  } catch (error) {
    console.error("Error fetching events:", error);
  }

  // Listen for search input changes
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    searchEvents(query, allEvents);
  });

  function displayEvents(events) {
    cardsContainer.innerHTML = ""; // Clear existing cards

    if (events.length === 0) {
      const noEventsMessage = document.createElement("div");
      noEventsMessage.className = "no-events";
      noEventsMessage.innerHTML = "<h1>No events</h1>";
      cardsContainer.appendChild(noEventsMessage);
    } else {
      events.forEach((event) => {
        const card = createEventCard(event);
        cardsContainer.appendChild(card);
      });
    }
  }

  function searchEvents(query, events) {
    if (!query) {
      displayEvents(events); // Show all events if no query
      return;
    }

    const filteredEvents = events.filter(
      (event) =>
        event.eventname.toLowerCase().includes(query) ||
        event.type.toLowerCase().includes(query) ||
        event.adminusername.toLowerCase().includes(query)
    );

    displayEvents(filteredEvents);
  }

  function filterEvents(events, filter) {
    let filteredEvents = [];
    const currentDate = new Date();

    switch (filter) {
      case "You as admin":
        filteredEvents = events.filter(
          (event) => event.adminusername === adminUsername
        );
        break;
      case "You as organizer":
        filteredEvents = events.filter(
          (event) =>
            event.organizers && event.organizers.includes(adminUsername)
        );
        break;
      case "You as participant":
        filteredEvents = events.filter(
          (event) =>
            event.participants && event.participants.includes(adminUsername)
        );
        break;
      case "Completed Events":
        filteredEvents = events.filter(
          (event) => new Date(event.datetimeEnd) < currentDate
        );
        break;
      case "Active Events":
        filteredEvents = events.filter(
          (event) =>
            new Date(event.datetimeStart) <= currentDate &&
            new Date(event.datetimeEnd) >= currentDate
        );
        break;
      case "Upcoming Events":
        filteredEvents = events.filter(
          (event) => new Date(event.datetimeStart) > currentDate
        );
        break;
      case "A - Z":
        filteredEvents = [...events].sort((a, b) =>
          a.eventname.localeCompare(b.eventname)
        );
        break;
      case "Z - A":
        filteredEvents = [...events].sort((a, b) =>
          b.eventname.localeCompare(a.eventname)
        );
        break;
      default:
        filteredEvents = events; // No filter applied
    }

    console.log("Filtered Events: ", filteredEvents); // Log the filtered events
    displayEvents(filteredEvents);
  }

  function createEventCard(event) {
    const cardContainer = document.createElement("div");
    cardContainer.className = "card-container";

    const isCompleted = new Date(event.datetimeEnd) < new Date();

    cardContainer.innerHTML = `
      <div class="top-container">
          <img class="hero-image" src="${event.posterlink}" alt="Event Image"/>
      </div>
      <div class="bottom-container">
          <div class="titlename">${event.eventname}</div>
          <div class="host">
              <p class="col1 hosting">Host</p>
              <a class="col2 host-name" href="../profileView/">${
                event.adminusername
              }</a>
          </div>
          <div class="domain">
              <p class="col1 domaining">Type</p>
              <p class="col2 domain-name">${event.type}</p>
          </div>
          <div class="date">
              <p class="col1 date-heading">Date</p>
              <p class="col2 date-val">${new Date(
                event.datetimeStart
              ).toLocaleDateString()}</p>
          </div>
          <div class="time">
              <p class="col1 time-heading">Time</p>
              <p class="col2 time-val">${new Date(
                event.datetimeStart
              ).toLocaleTimeString()} - ${new Date(
      event.datetimeEnd
    ).toLocaleTimeString()}</p>
          </div>
          <div class="more">
              <a class="more-details" href="../moredetails/?id=${event._id}">
                  <button class="more-but" ${isCompleted ? "disabled" : ""}>
                      More Details
                  </button>
              </a>
          </div>
      </div>
    `;

    if (isCompleted) {
      cardContainer.querySelector(".more-but").classList.add("disabled");
      cardContainer.querySelector(".more-but").textContent = "Completed";
      cardContainer.querySelector(".more-details").href = "#";
    }

    return cardContainer;
  }
});
