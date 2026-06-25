import Api from "./api.js";
import Auth from "./auth.js";
import Storage from "./storage.js";

Auth.requireAuth();

/* ==========================
   USER INFO
========================== */

const userName =
    document.getElementById("userName");

const roleBadge =
    document.getElementById("roleBadge");

const name =
    Storage.getName() || "User";

const role =
    (
        Storage.getRole() ||
        "CUSTOMER"
    ).toUpperCase();

console.log("ROLE =", role);

const roleNames = {
    ADMIN: "Admin",
    SUPER_ADMIN: "Super Admin",
    WAREHOUSE_MANAGER: "Warehouse Manager",
    PHARMACIST: "Pharmacist",
    CUSTOMER: "Customer"
};

if (userName) {
    userName.textContent = name;
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
    ?.addEventListener("click", (e) => {

        e.preventDefault();

        Auth.logout();

    });

/* ==========================
   CARD NAVIGATION
========================== */

document
    .getElementById("medicineCard")
    ?.addEventListener("click", () => {

        window.location.href =
            "medicines.html";

    });

document
    .getElementById("warehouseCard")
    ?.addEventListener("click", () => {

        window.location.href =
            "warehouses.html";

    });

document
    .getElementById("userCard")
    ?.addEventListener("click", () => {

        window.location.href =
            "users.html";

    });

document
    .getElementById("ordersCard")
    ?.addEventListener("click", () => {

        window.location.href =
            "orders.html";

    });

/* ==========================
   DASHBOARD COUNTS
========================== */

async function loadDashboard() {

    /* Medicines */

    if (role !== "WAREHOUSE_MANAGER") {

        try {

            const medicines =
                await Api.get("/medicines");

            console.log(
                "Medicines:",
                medicines
            );

            const medicineCount =
                document.getElementById(
                    "medicineCount"
                );

            if (
                medicineCount &&
                Array.isArray(
                    medicines
                )
            ) {

                medicineCount.textContent =
                    medicines.length;

            }

        } catch (error) {

            console.error(
                "Medicines Error:",
                error
            );

        }

    }

    /* Warehouses */

    if (
        role !== "CUSTOMER" &&
        role !== "PHARMACIST"
    ) {

        try {

            const warehouses =
                await Api.get(
                    "/warehouse-stock"
                );

            console.log(
                "Warehouses:",
                warehouses
            );

            const warehouseCount =
                document.getElementById(
                    "warehouseCount"
                );

            if (
                warehouseCount &&
                Array.isArray(
                    warehouses
                )
            ) {

                warehouseCount.textContent =
                    warehouses.length;

            }

        } catch (error) {

            console.error(
                "Warehouse Error:",
                error
            );

        }

    }

    /* Orders */

    try {

        const orders =
            await Api.get("/orders");

        console.log(
            "Orders:",
            orders
        );

        if (
            Array.isArray(
                orders
            )
        ) {

            const customerOrders =
                orders.filter(
                    order =>
                        order.order_type ===
                        "CUSTOMER"
                );

            const bulkOrders =
                orders.filter(
                    order =>
                        order.order_type ===
                        "BULK"
                );

            const customerOrderCount =
                document.getElementById(
                    "customerOrderCount"
                );

            const bulkOrderCount =
                document.getElementById(
                    "bulkOrderCount"
                );

            const totalOrderCount =
                document.getElementById(
                    "orderCount"
                );

            if (
                customerOrderCount
            ) {

                customerOrderCount.textContent =
                    customerOrders.length;

            }

            if (
                bulkOrderCount
            ) {

                bulkOrderCount.textContent =
                    bulkOrders.length;

            }

            if (
                totalOrderCount
            ) {

                totalOrderCount.textContent =
                    orders.length;

            }

        }

        /* Customer */

        if (
            role === "CUSTOMER"
        ) {

            document
                .getElementById(
                    "bulkOrderStats"
                )
                ?.remove();

            document
                .getElementById(
                    "totalOrderStats"
                )
                ?.remove();

        }

        /* Pharmacist */

        if (
            role === "PHARMACIST"
        ) {

            document
                .getElementById(
                    "totalOrderStats"
                )
                ?.remove();

        }

        /* Warehouse Manager */

        if (
            role === "WAREHOUSE_MANAGER"
        ) {

            document
                .getElementById(
                    "customerOrderStats"
                )
                ?.remove();

            document
                .getElementById(
                    "totalOrderStats"
                )
                ?.remove();

        }

    } catch (error) {

        console.error(
            "Orders Error:",
            error
        );

    }

    /* Users */

    if (
        role === "SUPER_ADMIN"
    ) {

        try {

            const users =
                await Api.get(
                    "/users"
                );

            console.log(
                "Users:",
                users
            );

            const userCount =
                document.getElementById(
                    "userCount"
                );

            if (
                userCount &&
                Array.isArray(users)
            ) {

                userCount.textContent =
                    users.length;

            }

        } catch (error) {

            console.error(
                "Users Error:",
                error
            );

        }

    }

}

loadDashboard();