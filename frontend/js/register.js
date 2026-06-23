import Api from "./api.js";

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const username = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    const confirmPassword = document.getElementById("confirmPassword").value;

    const role = document.getElementById("role").value;

    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;

    }

   const response = await Api.post("/auth/register", {
    username,
    email,
    password,
    role_name: role
});

    if (response.detail) {
    alert(response.detail);
    return;
}

alert("Account created successfully.");

    window.location.href = "login.html";

});