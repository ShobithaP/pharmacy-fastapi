import Api from "./api.js";

const table =
    document.getElementById(
        "warehouseTable"
    );

const searchInput =
    document.getElementById(
        "warehouseSearch"
    );

let warehouses = [];

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
                <td colspan="6">
                    Failed to load warehouse records
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
                <td colspan="6">
                    No warehouse records found
                </td>
            </tr>
        `;

        return;
    }

    data.forEach((warehouse) => {

        table.innerHTML += `
            <tr>

                <td>${warehouse.id}</td>

                <td>${warehouse.medicine_id}</td>

                <td>${warehouse.warehouse_name}</td>

                <td>${warehouse.location}</td>

                <td>${warehouse.stock_quantity}</td>

                <td>

                    <button
                        class="deleteWarehouseBtn"
                        data-id="${warehouse.id}">
                        Delete
                    </button>

                </td>

            </tr>
        `;

    });

}

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
                "Delete warehouse record?"
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
                    ${warehouse.medicine_id}
                    ${warehouse.warehouse_name}
                    ${warehouse.location}
                    ${warehouse.stock_quantity}
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