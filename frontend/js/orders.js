import Api from "./api.js";

const customerOrdersTable =
    document.getElementById(
        "customerOrdersTable"
    );

const bulkOrdersTable =
    document.getElementById(
        "bulkOrdersTable"
    );

const medicineSelect =
    document.getElementById(
        "medicineSelect"
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

const role =
    (localStorage.getItem("role") || "")
        .toUpperCase();

/* ==========================
   ROLE UI
========================== */

if (role === "PHARMACIST") {

    document
        .getElementById(
            "customerOrderSection"
        )
        ?.remove();

}

if (role !== "PHARMACIST") {

    document
        .getElementById(
            "bulkOrderSection"
        )
        ?.remove();

}

/* ==========================
   LOAD MEDICINES
========================== */

async function loadMedicines() {

    try {

        const medicines =
            await Api.get("/medicines");

        if (medicineSelect) {

            medicineSelect.innerHTML =
                `<option value="">
                    Select Medicine
                </option>`;

        }

        if (bulkMedicine) {

            bulkMedicine.innerHTML =
                `<option value="">
                    Select Medicine
                </option>`;

        }

        medicines.forEach(
            medicine => {

                if (medicineSelect) {

                    medicineSelect.innerHTML += `
                        <option value="${medicine.id}">
                            ${medicine.name}
                        </option>
                    `;

                }

                if (bulkMedicine) {

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
   LOAD ORDERS
========================== */

async function loadOrders() {

    try {

        const orders =
            await Api.get("/orders");

        customerOrdersTable.innerHTML = "";
        bulkOrdersTable.innerHTML = "";

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

        if (customerOrders.length === 0) {

            customerOrdersTable.innerHTML = `
                <tr>
                    <td colspan="5">
                        No customer orders found
                    </td>
                </tr>
            `;

        }

        if (bulkOrders.length === 0) {

            bulkOrdersTable.innerHTML = `
                <tr>
                    <td colspan="5">
                        No bulk orders found
                    </td>
                </tr>
            `;

        }

        customerOrders.forEach(
            order => {

                customerOrdersTable.innerHTML += `
                    <tr>

                        <td>${order.id}</td>

                        <td>${order.medicine_id}</td>

                        <td>${order.quantity}</td>

                        <td>${order.status}</td>

                        <td>

                           ${
    role === "PHARMACIST" &&
    order.status === "PENDING"
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
                "
            >
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
                    background:#2563eb;
                    color:white;
                    border:none;
                    border-radius:8px;
                    padding:8px 16px;
                    cursor:pointer;
                    margin-left:5px;
                "
            >
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

        bulkOrders.forEach(
            order => {

                bulkOrdersTable.innerHTML += `
                    <tr>

                        <td>${order.id}</td>

                        <td>${order.medicine_id}</td>

                        <td>${order.quantity}</td>

                        <td>${order.status}</td>

                        <td>

                            ${
    role === "WAREHOUSE_MANAGER" &&
    order.status === "PENDING"
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
                    font-weight:600;
                "
            >
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
                    background:#2563eb;
                    color:white;
                    border:none;
                    border-radius:8px;
                    padding:8px 16px;
                    cursor:pointer;
                    margin-left:5px;
                    font-weight:600;
                "
            >
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

    } catch (error) {

        console.error(error);

    }

}

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
                    medicine_id:
                        Number(
                            medicineSelect.value
                        ),
                    quantity:
                        Number(
                            document.getElementById(
                                "quantity"
                            ).value
                        ),
                    order_type:
                        "CUSTOMER"
                }
            );

            alert(
                "Order placed successfully"
            );

            orderForm.reset();

            loadOrders();

        } catch (error) {

            console.error(error);

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

                await Api.post(
                    "/orders",
                    {
                        medicine_id:
                            Number(
                                bulkMedicine.value
                            ),
                        quantity:
                            Number(
                                bulkQuantity.value
                            ),
                        order_type:
                            "BULK"
                    }
                );

                alert(
                    "Bulk order created"
                );

                loadOrders();

            } catch (error) {

                console.error(error);

            }

        }
    );

/* ==========================
   CUSTOMER APPROVAL
========================== */

customerOrdersTable.addEventListener(
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

bulkOrdersTable.addEventListener(
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

/* ==========================
   INITIAL LOAD
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

            console.error(error);

            alert(
                "Failed to delete order"
            );

        }

    }
);
loadMedicines();
loadOrders();
