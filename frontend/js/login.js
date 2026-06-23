import Api from "./api.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    try {

        const response = await Api.post(
            "/auth/login",
            {
                email,
                password
            }
        );

        localStorage.setItem(
            "token",
            response.access_token
        );

        localStorage.setItem(
            "name",
            response.user.username
        );

        localStorage.setItem(
            "role",
            response.user.role
        );

        localStorage.setItem(
            "email",
            response.user.email
        );

        window.location.href =
            "dashboard.html";

    }

    catch (error) {

        alert(error.message);

    }

});