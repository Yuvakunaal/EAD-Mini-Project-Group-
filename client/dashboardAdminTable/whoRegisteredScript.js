document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("eventId");
  
    if (!eventId) {
        console.error("Event ID not provided in the URL.");
        return;
    }
  
    try {
        const response = await fetch(`http://localhost:3000/api/events/${eventId}/registrations`);
        const result = await response.json();
  
        if (result.success) {
            const tableBody = document.querySelector("tbody");
            tableBody.innerHTML = "";

            result.data.forEach((user, index) => {
                const row = document.createElement("tr");

                const snoCell = document.createElement("td");
                snoCell.textContent = index + 1;

                const nameCell = document.createElement("td");
                const profileLink = document.createElement("a");
                profileLink.href = `../profileView/?username=${user.username}`; 
                profileLink.textContent = user.username;
                nameCell.appendChild(profileLink);

                const roleCell = document.createElement("td");
                roleCell.textContent = user.role;

                row.appendChild(snoCell);
                row.appendChild(nameCell);
                row.appendChild(roleCell);
                tableBody.appendChild(row);
            });
        } else {
            console.error("Failed to fetch registered users:", result.message);
        }
    } catch (error) {
        console.error("Error fetching registered users:", error);
    }
});
