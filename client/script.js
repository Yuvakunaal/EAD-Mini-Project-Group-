// add hovered class to selected list item
let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};

function confirmSignOut() {
  const a = confirm("Are you sure you want to sign out?");
  console.log(a);
  if (a) {
    localStorage.removeItem("token"); // Remove the JWT token
    window.location.href = "/client/login"; // Redirect to login page
  } else {
    window.location.href = "";
    console.log("signout cancelled.");
  }
}

function showProfile() {
  window.location.href = "../profileOwn/";
}
