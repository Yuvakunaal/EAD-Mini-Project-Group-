// Fetch upcoming events and inject them into the carousel
async function loadUpcomingEvents() {
  const carousel = document.getElementById("carousel");
  try {
    const response = await fetch("http://localhost:3000/api/upcoming-events"); // Change the URL to match your API
    const events = await response.json();

    if (events.length === 0) {
      // If no upcoming events, display the "No upcoming events" message
      const noEventsItem = document.createElement("div");
      noEventsItem.className = "carousel-item";
      noEventsItem.innerHTML = `
          <div class="d-block w-100">
            <h5>No upcoming events</h5>
          </div>
        `;
      carousel.appendChild(noEventsItem);
    } else {
      // Otherwise, loop through the events and display them
      events.forEach((event, index) => {
        const activeClass = index === 0 ? "active" : ""; // Make the first event active
        const item = document.createElement("div");
        item.className = `carousel-item ${activeClass}`;
        item.innerHTML = `
            <div class="d-block w-100">
              <h5>${event.eventname}</h5>
              <p>${new Date(event.datetimeStart).toLocaleString()}</p>
            </div>
          `;
        carousel.appendChild(item);
      });

      // Make it loopable infinitely with transition
      setInterval(() => {
        const firstItem = carousel.firstElementChild;
        const lastItem = carousel.lastElementChild;

        // Move the first item to the end with smooth transition
        carousel.style.transition = "transform 0.5s ease-in-out"; // Apply transition effect
        carousel.style.transform = "translateX(-100%)"; // Slide the items to the left

        // After the transition ends, reset the position and move the first item to the end
        carousel.addEventListener("transitionend", () => {
          carousel.style.transition = "none"; // Disable transition temporarily
          carousel.style.transform = "translateX(0)"; // Reset position
          carousel.appendChild(firstItem); // Move the first item to the end
        });
      }, 3000); // Change the timing (3000ms) as per your preference (3 seconds for example)
    }
  } catch (error) {
    console.error("Error loading events:", error);
  }
}

// Initialize the carousel
document.addEventListener("DOMContentLoaded", () => {
  loadUpcomingEvents();
});
