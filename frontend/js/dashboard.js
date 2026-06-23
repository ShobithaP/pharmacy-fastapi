import Api from "./api.js";
import Auth from "./auth.js";
import Storage from "./storage.js";

Auth.requireAuth();

/* ==========================
   USER INFO
========================== */

const userName = document.getElementById("userName");
const roleBadge = document.getElementById("roleBadge");

const name = Storage.getName() || "User";
const role = (Storage.getRole() || "CUSTOMER").toUpperCase();

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
   HIDE SUPER ADMIN FEATURES
========================== */
/* SUPER ADMIN ONLY */

if (role !== "SUPER_ADMIN") {

    document.getElementById("userStats")?.remove();
    document.getElementById("userCard")?.remove();

}

/* WAREHOUSE MANAGER */

if (role === "WAREHOUSE_MANAGER") {

    document.getElementById("medicineCard")?.remove();

    const medicineStat =
        document.getElementById("medicineCount")
        ?.closest(".stat-card");

    medicineStat?.remove();

}
/* CUSTOMER */

if (role === "CUSTOMER") {

    document.getElementById("warehouseCard")?.remove();

    const warehouseStat =
        document.getElementById("warehouseCount")
        ?.closest(".stat-card");

    warehouseStat?.remove();

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

/* ==========================
   DASHBOARD COUNTS
========================== */
async function loadDashboard() {

    if (role !== "WAREHOUSE_MANAGER") {

        try {

            const medicines =
                await Api.get("/medicines");

            const medicineCount =
                document.getElementById(
                    "medicineCount"
                );

            if (medicineCount) {

                medicineCount.textContent =
                    medicines?.length || 0;

            }

        } catch (error) {

            console.error(error);

            const medicineCount =
                document.getElementById(
                    "medicineCount"
                );

            if (medicineCount) {

                medicineCount.textContent =
                    "0";

            }

        }

    }

    if (role !== "CUSTOMER") {

    try {

        const warehouses =
            await Api.get(
                "/warehouse-stock"
            );

        const warehouseCount =
            document.getElementById(
                "warehouseCount"
            );

        if (warehouseCount) {

            warehouseCount.textContent =
                warehouses?.length || 0;

        }

    } catch (error) {

        console.error(error);

        const warehouseCount =
            document.getElementById(
                "warehouseCount"
            );

        if (warehouseCount) {

            warehouseCount.textContent =
                "0";

        }

    }

}

    if (role === "SUPER_ADMIN") {

        try {

            const users =
                await Api.get("/users");

            const userCount =
                document.getElementById(
                    "userCount"
                );

            if (userCount) {

                userCount.textContent =
                    users.length;

            }

        } catch (error) {

            console.error(error);

            const userCount =
                document.getElementById(
                    "userCount"
                );

            if (userCount) {

                userCount.textContent =
                    "0";

            }

        }

    }

}

loadDashboard();