import Api from "./api.js";
import Auth from "./auth.js";
import Storage from "./storage.js";

Auth.requireAuth();

/* ==========================
   USER INFO
========================== */

const userName =
    document.getElementById(
        "userName"
    );

const roleBadge =
    document.getElementById(
        "roleBadge"
    );

const name =
    Storage.getName() || "User";

const role =
    (
        Storage.getRole() ||
        "CUSTOMER"
    ).toUpperCase();

console.log(
    "ROLE =",
    role
);

const roleNames = {
    ADMIN: "Admin",
    SUPER_ADMIN: "Super Admin",
    WAREHOUSE_MANAGER:
        "Warehouse Manager",
    PHARMACIST: "Pharmacist",
    CUSTOMER: "Customer"
};

if (userName) {

    userName.textContent =
        name;

}

if (roleBadge) {

    roleBadge.textContent =
        roleNames[role] || role;

}

/* ==========================
   ROLE BASED UI
========================== */

if (role !== "SUPER_ADMIN") {

    document
        .getElementById("userStats")
        ?.remove();

    document
        .getElementById("userCard")
        ?.remove();

}

if (role === "WAREHOUSE_MANAGER") {

    document
        .getElementById("medicineCard")
        ?.remove();

    document
        .getElementById("medicineCount")
        ?.closest(".stat-card")
        ?.remove();

}

if (
    role === "CUSTOMER" ||
    role === "PHARMACIST"
) {

    document
        .getElementById("warehouseCard")
        ?.remove();

    document
        .getElementById("warehouseCount")
        ?.closest(".stat-card")
        ?.remove();

}

/* ==========================
   LOGOUT
========================== */

document
    .getElementById("logoutBtn")
    ?.addEventListener(
        "click",
        (e) => {

            e.preventDefault();

            Auth.logout();

        }
    );

/* ==========================
   CARD NAVIGATION
========================== */

document
    .getElementById("medicineCard")
    ?.addEventListener(
        "click",
        () => {

            window.location.href =
                "medicines.html";

        }
    );

document
    .getElementById("warehouseCard")
    ?.addEventListener(
        "click",
        () => {

            window.location.href =
                "warehouses.html";

        }
    );

document
    .getElementById("userCard")
    ?.addEventListener(
        "click",
        () => {

            window.location.href =
                "users.html";

        }
    );

document
    .getElementById("ordersCard")
    ?.addEventListener(
        "click",
        () => {

            window.location.href =
                "orders.html";

        }
    );

/* ==========================
   DASHBOARD COUNTS
========================== */

async function loadDashboard() {

    /* Medicines */

    if (
        role !==
        "WAREHOUSE_MANAGER"
    ) {

        try {

            const medicines =
                await Api.get(
                    "/medicines"
                );

            const medicineCount =
                document.getElementById(
                    "medicineCount"
                );

            if (
                medicineCount
            ) {

                medicineCount.textContent =
                    medicines.length;

            }

        } catch (error) {

            console.error(
                error
            );

        }

    }

    /* Warehouses */

    if (
        role !==
            "CUSTOMER" &&
        role !==
            "PHARMACIST"
    ) {

        try {

            const warehouses =
                await Api.get(
                    "/warehouse-stock"
                );

            const warehouseCount =
                document.getElementById(
                    "warehouseCount"
                );

            if (
                warehouseCount
            ) {

                warehouseCount.textContent =
                    warehouses.length;

            }

        } catch (error) {

            console.error(
                error
            );

        }

    }

    /* Orders */

    try {

        const orders =
            await Api.get(
                "/orders"
            );

        const orderCount =
            document.getElementById(
                "orderCount"
            );

        if (
            orderCount
        ) {

            orderCount.textContent =
                orders.length;

        }

    } catch (error) {

        console.error(
            error
        );

    }

    /* Users */

    if (
        role ===
        "SUPER_ADMIN"
    ) {

        try {

            const users =
                await Api.get(
                    "/users"
                );

            const userCount =
                document.getElementById(
                    "userCount"
                );

            if (
                userCount
            ) {

                userCount.textContent =
                    users.length;

            }

        } catch (error) {

            console.error(
                error
            );

        }

    }

}

loadDashboard();
``