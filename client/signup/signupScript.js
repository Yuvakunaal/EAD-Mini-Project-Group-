document.getElementById("login").addEventListener("click", function () {
  window.location.href = "../login/";
});

const signup = document.getElementById("signupForm");
signup.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("emailid").value.trim(); 
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const passwordError = document.getElementById("passwordError");
  const matchIcon = document.getElementById("matchIcon");
  const mismatchIcon = document.getElementById("mismatchIcon");
  const usernameInput = document.getElementById("username");
  const usernameError = document.getElementById("usernameError");
  const emailError = document.getElementById("emailidError");

  passwordError.style.display = "none";
  matchIcon.style.display = "none";
  mismatchIcon.style.display = "none";
  usernameError.style.display = "none";
  emailError.style.display = "none";

  if (username.length < 5 || username.length > 15) {
    usernameError.textContent = "Username must be between 5 and 15 characters.";
    usernameError.style.display = "block";
    usernameInput.focus();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    emailError.textContent = "Please enter a valid email address.";
    emailError.style.display = "block";
    document.getElementById("emailid").focus();
    return;
  }

  if (password === confirmPassword) {
    passwordError.textContent = "Passwords match!";
    passwordError.style.color = "green";
    passwordError.style.display = "block";
    matchIcon.style.display = "inline";
    mismatchIcon.style.display = "none";

    const res = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("token", data.token);
      alert("Signup success");
      window.location.href = "../login/";
    } else {
        if (data.message === "Username already exists. Please choose another one.") {
            alert(data.message);
        } else {
            alert("Signup failed. Please try again.");
        }
        location.reload();
    }
  } else {
    passwordError.textContent = "Passwords do not match!";
    passwordError.style.color = "red";
    passwordError.style.display = "block";
    matchIcon.style.display = "none";
    mismatchIcon.style.display = "inline";
  }
});

const togglePassword = document.querySelector("#togglePassword");
const passwordInput = document.querySelector("#password");

togglePassword.addEventListener("click", function () {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  this.classList.toggle("fa-eye-slash");
});

const toggleConfirmPassword = document.querySelector("#toggleConfirmPassword");
const confirmPasswordInput = document.querySelector("#confirmPassword");

toggleConfirmPassword.addEventListener("click", function () {
  const type =
    confirmPasswordInput.getAttribute("type") === "password"
      ? "text"
      : "password";
  confirmPasswordInput.setAttribute("type", type);
  this.classList.toggle("fa-eye-slash");
});

confirmPasswordInput.addEventListener("input", function () {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (password === confirmPassword) {
    matchIcon.style.display = "inline";
    mismatchIcon.style.display = "none";
  } else {
    matchIcon.style.display = "none";
    mismatchIcon.style.display = "inline";
  }
});
