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