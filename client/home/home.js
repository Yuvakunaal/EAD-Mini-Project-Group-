async function loadUpcomingEvents() {
  const carousel = document.getElementById("carousel");
  try {
    const response = await fetch("http://localhost:3000/api/upcoming-events");
    const events = await response.json();

    if (events.length === 0) {
      const noEventsItem = document.createElement("div");
      noEventsItem.className = "carousel-item";
      noEventsItem.innerHTML = `
          <div class="d-block w-100">
            <h5>No upcoming events</h5>
          </div>
        `;
      carousel.appendChild(noEventsItem);
    } else {
      events.forEach((event, index) => {
        const activeClass = index === 0 ? "active" : "";
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

      setInterval(() => {
        const firstItem = carousel.firstElementChild;
        const lastItem = carousel.lastElementChild;

        carousel.style.transition = "transform 0.5s ease-in-out"; 
        carousel.style.transform = "translateX(-100%)";

        carousel.addEventListener("transitionend", () => {
          carousel.style.transition = "none";
          carousel.style.transform = "translateX(0)";
          carousel.appendChild(firstItem);
        });
      }, 3000);
    }
  } catch (error) {
    console.error("Error loading events:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadUpcomingEvents();
});
