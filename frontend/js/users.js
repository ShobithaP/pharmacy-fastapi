import Api from "./api.js";

const table = document.getElementById("userTable");
const searchInput = document.getElementById("searchUser");

let users = [];

async function loadUsers() {

    try {

        users = await Api.get("/users");

        renderTable(users);

    } catch (error) {

        console.error(error);

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to load users
                </td>
            </tr>
        `;

    }

}

function renderTable(data) {

    table.innerHTML = "";

    if (!data.length) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No users found
                </td>
            </tr>
        `;

        return;

    }

    data.forEach(user => {

        table.innerHTML += `
            <tr>

                <td>${user.id}</td>

                <td>${user.username}</td>

                <td>${user.email}</td>

                <td>${user.role}</td>

                <td>

                    <button
                        class="action-btn deleteBtn"
                        data-id="${user.id}">
                        Delete
                    </button>

                </td>

            </tr>
        `;

    });

}

table.addEventListener(
    "click",
    async (e) => {

        const id =
            e.target.dataset.id;

        if (!id) return;

        if (
            e.target.classList.contains(
                "deleteBtn"
            )
        ) {

            if (
                !confirm(
                    "Delete this user?"
                )
            ) {
                return;
            }

            try {

                await Api.post(
                    `/users/delete/${id}`,
                    {}
                );

                loadUsers();

            } catch (error) {

                console.error(error);

                alert(
                    "Delete failed"
                );

            }

        }

    }
);

searchInput.addEventListener(
    "input",
    () => {

        const keyword =
            searchInput.value
                .trim()
                .toLowerCase();

        if (!keyword) {

            renderTable(users);

            return;

        }

        const filtered =
            users.filter(user =>

                `
                ${user.id}
                ${user.username}
                ${user.email}
                ${user.role}
                `
                .toLowerCase()
                .includes(keyword)

            );

        renderTable(filtered);

    }
);

document
    .getElementById("logoutBtn")
    ?.addEventListener(
        "click",
        () => {

            localStorage.clear();

            window.location.href =
                "login.html";

        }
    );

loadUsers();
document
    .getElementById("addUserBtn")
    ?.addEventListener("click", () => {

        document
            .getElementById("userModal")
            ?.classList.add("show");

    });
document
    .getElementById("cancelBtn")
    ?.addEventListener("click", () => {

        document
            .getElementById("userModal")
            ?.classList.remove("show");

    });
document
    .getElementById("userForm")
    ?.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            try {

                await Api.post(
                    "/auth/register",
                    {
                        username:
                            document.getElementById(
                                "username"
                            ).value,

                        email:
                            document.getElementById(
                                "email"
                            ).value,

                        password:
                            document.getElementById(
                                "password"
                            ).value,

                        role:
                            document.getElementById(
                                "role"
                            ).value
                    }
                );

                alert(
                    "User created successfully"
                );

                document
                    .getElementById("userModal")
                    ?.classList.remove(
                        "show"
                    );

                document
                    .getElementById("userForm")
                    ?.reset();

                loadUsers();

            } catch (error) {

                console.error(error);

                alert(
                    "Failed to create user"
                );

            }

        }
    );
document
    .getElementById("userForm")
    ?.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            try {

                await Api.post(
                    "/auth/register",
                    {
                        username:
                            document.getElementById(
                                "username"
                            ).value,

                        email:
                            document.getElementById(
                                "email"
                            ).value,

                        password:
                            document.getElementById(
                                "password"
                            ).value,

                        role:
                            document.getElementById(
                                "role"
                            ).value
                    }
                );

                alert(
                    "User created successfully"
                );

                document
                    .getElementById("userModal")
                    ?.classList.remove(
                        "show"
                    );

                document
                    .getElementById("userForm")
                    ?.reset();

                loadUsers();

            } catch (error) {

                console.error(error);

                alert(
                    error?.response?.data?.detail ||
                    "Failed to create user"
                );

            }

        }
    );