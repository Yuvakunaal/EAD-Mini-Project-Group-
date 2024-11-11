document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
  
    if (token) {
      try {
        // Fetch user profile data from the server
        const decodedToken = jwt_decode(token);
        const response = await fetch(
          `http://localhost:3000/userProfile/${decodedToken.username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
  
        const result = await response.json();
  
        if (result.success) {
          const user = result.data;
          // Populate input fields with data from the server
          document.getElementById("bio").value = user.bio || "";
          document.getElementById("interests").value = user.interests || ""; // Ensure this matches the server response
          document.getElementById("profilePicture").value = user.profilePicture || "";
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        alert("An error occurred while fetching the profile data.");
        window.location.href = "../profileOwn/index.html"; // Redirect to profile page if error occurs
      }
    } else {
      alert("User not logged in!");
      window.location.href = "../login/"; // Redirect to login if no token found
    }
  
    // Event listener for saving changes
    document.getElementById("saveChanges").addEventListener("click", async () => {
      const bio = document.getElementById("bio").value;
      const interests = document.getElementById("interests").value; // Keep this as a single string
      const profilePicture = document.getElementById("profilePicture").value;
  
      try {
        const response = await fetch("http://localhost:3000/updateProfile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bio, interest: interests, profilePicture }), // Send interest as a string
        });
  
        if (!response.ok) {
          const errorData = await response.text();
          alert("Failed to update profile: " + errorData);
          return;
        }
  
        const data = await response.json();
        alert("Profile updated successfully!");
        window.location.href = "../profileOwn/index.html"; // Redirect back to profile page
      } catch (error) {
        console.error("Error during profile update:", error);
        alert("Failed to update profile: " + error.message);
      }
    });
  });
  