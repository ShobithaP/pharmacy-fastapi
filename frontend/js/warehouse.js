import Api from "./api.js";

const table =
    document.getElementById(
        "warehouseTable"
    );

const searchInput =
    document.getElementById(
        "warehouseSearch"
    );

const modal =
    document.getElementById(
        "modal"
    );

const role =
    (
        localStorage.getItem("role") || ""
    ).toUpperCase();

let warehouses = [];

/* ==========================
   ROLE UI
========================== */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        const addButton =
            document.querySelector(
                ".header-actions .primary-btn"
            );

        if (
            role !== "ADMIN" &&
            role !== "SUPER_ADMIN"
        ) {
            addButton?.remove();
        }

    }
);

/* ==========================
   LOAD WAREHOUSES
========================== */

async function loadWarehouses() {

    try {

        warehouses =
            await Api.get(
                "/warehouse/"
            );

        renderTable(
            warehouses
        );

    } catch (error) {

        console.error(error);

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to load warehouses
                </td>
            </tr>
        `;
    }

}

/* ==========================
   RENDER TABLE
========================== */

function renderTable(data) {

    table.innerHTML = "";

    if (!data || data.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No warehouses found
                </td>
            </tr>
        `;

        return;
    }

    data.forEach((warehouse) => {

        table.innerHTML += `
            <tr>

                <td>${warehouse.id}</td>

                <td>${warehouse.warehouse_name}</td>

                <td>${warehouse.location}</td>

                <td>${warehouse.manager_id}</td>

                <td>

                    ${
                        role === "ADMIN" ||
                        role === "SUPER_ADMIN"
                        ? `
                        <button
                            class="deleteWarehouseBtn"
                            data-id="${warehouse.id}">
                            Delete
                        </button>
                        `
                        : ""
                    }

                </td>

            </tr>
        `;

    });

}

/* ==========================
   OPEN MODAL
========================== */

window.openAddModal = function () {

    modal.style.display = "flex";

};

/* ==========================
   CLOSE MODAL
========================== */

window.closeModal = function () {

    modal.style.display = "none";

};

/* ==========================
   SAVE WAREHOUSE
========================== */

window.saveWarehouse = async function () {

    try {

        const warehouseName =
            document.getElementById(
                "warehouse_name"
            ).value.trim();

        const location =
            document.getElementById(
                "location"
            ).value.trim();

        const managerId =
            Number(
                document.getElementById(
                    "manager_id"
                ).value
            );

        if (
            !warehouseName ||
            !location ||
            !managerId
        ) {

            alert(
                "Please fill all fields"
            );

            return;
        }

        await Api.post(
            "/warehouse/",
            {
                warehouse_name:
                    warehouseName,
                location:
                    location,
                manager_id:
                    managerId
            }
        );

        alert(
            "Warehouse created successfully"
        );

        closeModal();

        loadWarehouses();

    } catch (error) {

        console.error(error);

        alert(
            "Failed to create warehouse"
        );

    }

};

/* ==========================
   DELETE
========================== */

table.addEventListener(
    "click",
    async (e) => {

        if (
            !e.target.classList.contains(
                "deleteWarehouseBtn"
            )
        ) {
            return;
        }

        const id =
            Number(
                e.target.dataset.id
            );

        if (
            !confirm(
                "Delete warehouse?"
            )
        ) {
            return;
        }

        try {

            await Api.post(
                "/warehouse/delete",
                { id }
            );

            loadWarehouses();

        } catch (error) {

            console.error(error);

            alert(
                "Delete failed"
            );

        }

    }
);

/* ==========================
   SEARCH
========================== */

searchInput?.addEventListener(
    "input",
    () => {

        const keyword =
            searchInput.value
                .trim()
                .toLowerCase();

        if (!keyword) {

            renderTable(
                warehouses
            );

            return;

        }

        const filtered =
            warehouses.filter(
                warehouse =>
                    `
                    ${warehouse.id}
                    ${warehouse.warehouse_name}
                    ${warehouse.location}
                    ${warehouse.manager_id}
                    `
                        .toLowerCase()
                        .includes(
                            keyword
                        )
            );

        renderTable(
            filtered
        );

    }
);

/* ==========================
   INITIAL LOAD
========================== */

loadWarehouses();