import Api from "./api.js";

const customerOrdersTable =
    document.getElementById(
        "customerOrdersTable"
    );

const bulkOrdersTable =
    document.getElementById(
        "bulkOrdersTable"
    );

const customerHistoryTable =
    document.getElementById(
        "customerHistoryTable"
    );

const bulkHistoryTable =
    document.getElementById(
        "bulkHistoryTable"
    );

const medicineSelect =
    document.getElementById(
        "medicineSelect"
    );

const pharmacistSelect =
    document.getElementById(
        "pharmacistSelect"
    );

const orderForm =
    document.getElementById(
        "orderForm"
    );

const bulkMedicine =
    document.getElementById(
        "bulkMedicine"
    );

const bulkQuantity =
    document.getElementById(
        "bulkQuantity"
    );

const warehouseSelect =
    document.getElementById(
        "warehouseSelect"
    );

const role =
    (localStorage.getItem("role") || "")
        .toUpperCase();

/* ==========================
   ROLE UI
========================== */

console.log(
    "Current Role:",
    role
);

window.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            role === "PHARMACIST"
        ) {

            document
                .getElementById(
                    "customerOrderSection"
                )
                ?.remove();

        }

        if (
            role === "CUSTOMER"
        ) {

            document
                .getElementById(
                    "bulkOrderSection"
                )
                ?.remove();

            document
                .getElementById(
                    "bulkOrdersViewSection"
                )
                ?.remove();

        }

        if (
            role === "WAREHOUSE_MANAGER"
        ) {

            document
                .getElementById(
                    "customerOrderSection"
                )
                ?.remove();

            document
                .getElementById(
                    "bulkOrderSection"
                )
                ?.remove();

        }

    }
);

/* ==========================
   LOAD MEDICINES
========================== */

async function loadMedicines() {

    try {

        const medicines =
            await Api.get(
                "/medicines"
            );

        if (medicineSelect) {

            medicineSelect.innerHTML =
                `
                <option value="">
                    Select Medicine
                </option>
                `;

        }

        if (bulkMedicine) {

            bulkMedicine.innerHTML =
                `
                <option value="">
                    Select Medicine
                </option>
                `;

        }

        medicines.forEach(
            medicine => {

                if (
                    medicineSelect
                ) {

                    medicineSelect.innerHTML += `
                        <option value="${medicine.id}">
                            ${medicine.name}
                        </option>
                    `;

                }

                if (
                    bulkMedicine
                ) {

                    bulkMedicine.innerHTML += `
                        <option value="${medicine.id}">
                            ${medicine.name}
                        </option>
                    `;

                }

            }
        );

    } catch (error) {

        console.error(error);

    }

}

/* ==========================
   LOAD PHARMACISTS
========================== */

async function loadPharmacists() {

    if (
        !pharmacistSelect
    ) {
        return;
    }

    try {

        const users =
            await Api.get(
                "/users"
            );

        pharmacistSelect.innerHTML = `
            <option value="">
                Select Pharmacist
            </option>
        `;

        users
            .filter(
                user =>
                    (
                        user.role_name ||
                        user.role
                    ) === "PHARMACIST"
            )
            .forEach(
                pharmacist => {

                    pharmacistSelect.innerHTML += `
                        <option value="${pharmacist.id}">
                            ${pharmacist.name}
                        </option>
                    `;

                }
            );

    } catch (error) {

        console.error(error);

    }

}

/* ==========================
   LOAD WAREHOUSES
========================== */

async function loadWarehouses() {

    if (
        !warehouseSelect
    ) {
        return;
    }

    try {

        const warehouses =
            await Api.get(
                "/warehouse/"
            );

        warehouseSelect.innerHTML = `
            <option value="">
                Select Warehouse
            </option>
        `;

        warehouses.forEach(
            warehouse => {

                warehouseSelect.innerHTML += `
                    <option value="${warehouse.id}">
                        ${warehouse.warehouse_name}
                    </option>
                `;

            }
        );

    } catch (error) {

        console.error(error);

    }

}/* ==========================
   LOAD ORDERS
========================== */

async function loadOrders() {

    try {

        const orders =
            await Api.get(
                "/orders"
            );
        console.log(orders[0]);



        customerOrdersTable.innerHTML = "";
        bulkOrdersTable.innerHTML = "";

        if (customerHistoryTable) {
            customerHistoryTable.innerHTML = "";
        }

        if (bulkHistoryTable) {
            bulkHistoryTable.innerHTML = "";
        }

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

        const pendingCustomerOrders =
            customerOrders.filter(
                order =>
                    order.status ===
                    "PENDING"
            );

        const customerHistory =
            customerOrders.filter(
                order =>
                    order.status !==
                    "PENDING"
            );

        const pendingBulkOrders =
            bulkOrders.filter(
                order =>
                    order.status ===
                    "PENDING"
            );

        const bulkHistory =
            bulkOrders.filter(
                order =>
                    order.status !==
                    "PENDING"
            );

        /* ==========================
           CUSTOMER PENDING
        ========================== */

        if (
            pendingCustomerOrders.length === 0
        ) {

            customerOrdersTable.innerHTML = `
                <tr>
                    <td colspan="5">
                        No customer orders pending
                    </td>
                </tr>
            `;

        } else {

            pendingCustomerOrders.forEach(
                order => {

                    customerOrdersTable.innerHTML += `
                        <tr>

                            <td>${order.id}</td>

                            <td>${order.medicine_name}</td>

                            <td>${order.quantity}</td>

                            <td>${order.status}</td>

                            <td>

                                ${
                                    role === "PHARMACIST"
                                    ? `
                                        <button
                                            class="approveBtn"
                                            data-id="${order.id}"
                                            style="
                                                background:#16a34a;
                                                color:white;
                                                border:none;
                                                border-radius:8px;
                                                padding:8px 16px;
                                                cursor:pointer;
                                            ">
                                            Approve
                                        </button>
                                    `
                                    : ""
                                }

                                ${
                                    role === "SUPER_ADMIN"
                                    ? `
                                        <button
                                            class="deleteOrderBtn"
                                            data-id="${order.id}"
                                            style="
                                                background:#dc2626;
                                                color:white;
                                                border:none;
                                                border-radius:8px;
                                                padding:8px 16px;
                                                cursor:pointer;
                                                margin-left:5px;
                                            ">
                                            Delete
                                        </button>
                                    `
                                    : ""
                                }

                            </td>

                        </tr>
                    `;

                }
            );

        }

        /* ==========================
           CUSTOMER HISTORY
        ========================== */

        if (customerHistoryTable) {

            if (
                customerHistory.length === 0
            ) {

                customerHistoryTable.innerHTML = `
                    <tr>
                        <td colspan="4">
                            No customer order history
                        </td>
                    </tr>
                `;

            } else {

                customerHistory.forEach(
                    order => {

                        customerHistoryTable.innerHTML += `
                            <tr>

                                <td>${order.id}</td>

                                <td>${order.medicine_name}</td>

                                <td>${order.quantity}</td>

                                <td>${order.status}</td>

                            </tr>
                        `;

                    }
                );

            }

        }

        /* ==========================
           BULK PENDING
        ========================== */

        if (
            pendingBulkOrders.length === 0
        ) {

            bulkOrdersTable.innerHTML = `
                <tr>
                    <td colspan="5">
                        No bulk orders pending
                    </td>
                </tr>
            `;

        } else {

            pendingBulkOrders.forEach(
                order => {

                    bulkOrdersTable.innerHTML += `
                        <tr>

                            <td>${order.id}</td>

                            <td>${order.medicine_name}</td>

                            <td>${order.quantity}</td>

                            <td>${order.status}</td>

                            <td>

                                ${
                                    role === "WAREHOUSE_MANAGER"
                                    ? `
                                        <button
                                            class="approveBulkBtn"
                                            data-id="${order.id}"
                                            style="
                                                background:#16a34a;
                                                color:white;
                                                border:none;
                                                border-radius:8px;
                                                padding:8px 16px;
                                                cursor:pointer;
                                            ">
                                            Approve
                                        </button>
                                    `
                                    : ""
                                }

                                ${
                                    role === "SUPER_ADMIN"
                                    ? `
                                        <button
                                            class="deleteOrderBtn"
                                            data-id="${order.id}"
                                            style="
                                                background:#dc2626;
                                                color:white;
                                                border:none;
                                                border-radius:8px;
                                                padding:8px 16px;
                                                cursor:pointer;
                                                margin-left:5px;
                                            ">
                                            Delete
                                        </button>
                                    `
                                    : ""
                                }

                            </td>

                        </tr>
                    `;

                }
            );

        }

        /* ==========================
           BULK HISTORY
        ========================== */

        if (bulkHistoryTable) {

            if (
                bulkHistory.length === 0
            ) {

                bulkHistoryTable.innerHTML = `
                    <tr>
                        <td colspan="4">
                            No bulk order history
                        </td>
                    </tr>
                `;

            } else {

                bulkHistory.forEach(
                    order => {

                        bulkHistoryTable.innerHTML += `
                            <tr>

                                <td>${order.id}</td>

                                <td>${order.medicine_name}</td>

                                <td>${order.quantity}</td>

                                <td>${order.status}</td>

                            </tr>
                        `;

                    }
                );

            }

        }

    } catch (error) {

        console.error(error);

    }

}
async function
loadWarehousesForMedicine() {

    const medicineId =
        bulkMedicine.value;

    if (!medicineId) {
        return;
    }

    const warehouses =
    await Api.get(
        `/warehouse/medicine/${medicineId}`
    );

    warehouseSelect.innerHTML =
        `
        <option value="">
            Select Warehouse
        </option>
        `;

    warehouses.forEach(
        warehouse => {

            warehouseSelect.innerHTML += `
                <option value="${warehouse.id}">
                    ${warehouse.warehouse_name}
                </option>
            `;

        }
    );

}
``
/* ==========================
   CUSTOMER ORDER
========================== */

orderForm?.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        try {

            await Api.post(
                "/orders",
                {
                    medicine_id: Number(
                        medicineSelect.value
                    ),

                    pharmacist_id: Number(
                        pharmacistSelect.value
                    ),

                    quantity: Number(
                        document.getElementById(
                            "quantity"
                        ).value
                    ),

                    order_type: "CUSTOMER"
                }
            );

            alert(
                "Order placed successfully"
            );

            orderForm.reset();

            loadOrders();

        } catch (error) {

            console.error(error);

            alert(
                "Failed to place order"
            );

        }

    }
);
/* ==========================
   BULK ORDER
========================== */

document
    .getElementById(
        "submitBulkOrder"
    )
    ?.addEventListener(
        "click",
        async () => {

            try {

                const response =
    await Api.post(
        "/orders",
        {
            medicine_id:
                Number(
                    bulkMedicine.value
                ),

            warehouse_id:
                Number(
                    warehouseSelect.value
                ),

            quantity:
                Number(
                    bulkQuantity.value
                ),

            order_type:
                "BULK"
        }
    );
if (
    response.message &&
    response.message.includes(
        "Available stock"
    )
) {

    alert(
        response.message
    );

    return;

}
                alert(
                    "Bulk order created"
                );

                loadOrders();

            } catch (error) {

    console.error(error);

    alert(
        error?.response?.data?.detail ||
        "Failed to create bulk order"
    );

}

        }
    );


/* ==========================
   CUSTOMER APPROVAL
========================== */

customerOrdersTable
    ?.addEventListener(
        "click",
        async (e) => {

            if (
                !e.target.classList.contains(
                    "approveBtn"
                )
            ) {
                return;
            }

            const id =
                e.target.dataset.id;

            try {

                await Api.post(
                    `/orders/approve/${id}`,
                    {}
                );

                loadOrders();

            } catch (error) {

                console.error(error);

            }

        }
    );


/* ==========================
   BULK APPROVAL
========================== */

bulkOrdersTable
    ?.addEventListener(
        "click",
        async (e) => {

            if (
                !e.target.classList.contains(
                    "approveBulkBtn"
                )
            ) {
                return;
            }

            const id =
                e.target.dataset.id;

            try {

                await Api.post(
                    `/orders/approve/${id}`,
                    {}
                );

                loadOrders();

            } catch (error) {

                console.error(error);

            }

        }
    );

bulkMedicine.addEventListener(
    "change",
    loadWarehousesForMedicine
);

/* ==========================
   DELETE ORDER
========================== */

document.addEventListener(
    "click",
    async (e) => {

        if (
            !e.target.classList.contains(
                "deleteOrderBtn"
            )
        ) {
            return;
        }

        const id =
            e.target.dataset.id;

        if (
            !confirm(
                "Delete this order?"
            )
        ) {
            return;
        }

        try {

            await Api.post(
                `/orders/delete/${id}`,
                {}
            );

            alert(
                "Order deleted successfully"
            );

            loadOrders();

        } catch (error) {

    console.error("Bulk Order Error:", error);

    alert(
        error?.response?.data?.detail ||
        error?.message ||
        JSON.stringify(error)
    );

}

    }
);


/* ==========================
   INITIAL LOAD
========================== */

loadMedicines();
loadPharmacists();

loadOrders();