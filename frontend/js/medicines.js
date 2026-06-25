import Api from "./api.js";

const table = document.getElementById("medicineTable");
const modal = document.getElementById("medicineModal");
const form = document.getElementById("medicineForm");

const addBtn = document.getElementById("addMedicineBtn");
const cancelBtn = document.getElementById("cancelBtn");
const modalTitle = document.getElementById("modalTitle");

const medicineId = document.getElementById("medicineId");
const nameInput = document.getElementById("name");
const manufacturerInput = document.getElementById("manufacturer");
const priceInput = document.getElementById("price");

const searchInput = document.getElementById("searchMedicine");

const role =
    (localStorage.getItem("role") || "")
        .toUpperCase();

/* ==========================
   CUSTOMER RESTRICTIONS
========================== */

if (role === "CUSTOMER") {

    document
        .getElementById("addMedicineBtn")
        ?.remove();

    document
        .getElementById("uploadMedicineBtn")
        ?.remove();

    document
        .getElementById("downloadMedicineBtn")
        ?.remove();

}

let medicines = [];

window.addEventListener(
    "DOMContentLoaded",
    loadMedicines
);

/* ==========================
   MODAL
========================== */

addBtn?.addEventListener("click", () => {

    form.reset();

    medicineId.value = "";

    modalTitle.textContent =
        "Add Medicine";

    modal.classList.add("show");

});

cancelBtn?.addEventListener("click", () => {

    modal.classList.remove("show");

});

window.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.classList.remove("show");

    }

});

/* ==========================
   LOAD MEDICINES
========================== */

async function loadMedicines() {

    try {

        medicines = await Api.get(
            "/medicines"
        );

        renderTable(medicines);

    } catch (error) {

        console.error(error);

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to load medicines
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
                    No medicines found
                </td>
            </tr>
        `;

        return;

    }

    data.forEach((medicine) => {

        table.innerHTML += `
            <tr>

                <td>${medicine.id}</td>

                <td>${medicine.name}</td>

                <td>${medicine.manufacturer}</td>

                <td>${Number(medicine.price).toFixed(2)}</td>

                <td>

                    ${
                        role === "CUSTOMER"
                            ? ""
                            : `
                                <button
                                    class="action-btn deleteBtn"
                                    data-id="${medicine.id}">
                                    Delete
                                </button>
                              `
                    }

                </td>

            </tr>
        `;

    });

}

/* ==========================
   ADD MEDICINE
========================== */

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const medicine = {

        name: nameInput.value.trim(),

        manufacturer:
            manufacturerInput.value.trim(),

        price: Number(
            priceInput.value
        )

    };

    try {

        await Api.post(
            "/medicines",
            medicine
        );

        alert(
            "Medicine added successfully"
        );

        modal.classList.remove("show");

        form.reset();

        loadMedicines();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to save medicine"
        );

    }

});

/* ==========================
   DELETE MEDICINE
========================== */

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
                    "Are you sure you want to delete this medicine?"
                )
            ) {
                return;
            }

            try {

                await Api.post(
                    `/medicines/delete/${id}`,
                    {}
                );

                loadMedicines();

            } catch (error) {

                console.error(error);

                alert(
                    "Delete failed"
                );

            }

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
                medicines
            );

            return;

        }

        const filtered =
            medicines.filter(
                (medicine) =>

                    `
                    ${medicine.id}
                    ${medicine.name}
                    ${medicine.manufacturer}
                    ${medicine.price}
                    `
                        .toLowerCase()
                        .includes(keyword)

            );

        renderTable(
            filtered
        );

    }
);

/* ==========================
   UPLOAD CSV
========================== */

document
    .getElementById(
        "uploadMedicineBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "medicineCsvFile"
                )
                .click();

        }
    );

document
    .getElementById(
        "medicineCsvFile"
    )
    ?.addEventListener(
        "change",
        async (e) => {

            try {

                const file =
                    e.target.files[0];

                if (!file) return;

                const formData =
                    new FormData();

                formData.append(
                    "file",
                    file
                );

                const response =
                    await fetch(
                        "http://127.0.0.1:8000/medicines/upload",
                        {
                            method:
                                "POST",
                            body:
                                formData
                        }
                    );

                if (
                    !response.ok
                ) {

                    alert(
                        "Upload failed"
                    );

                    return;

                }

                alert(
                    "CSV uploaded successfully"
                );

                loadMedicines();

            } catch (error) {

                console.error(
                    error
                );

                alert(
                    "CSV upload failed"
                );

            }

        }
    );

/* ==========================
   DOWNLOAD CSV
========================== */

document
    .getElementById("downloadMedicineBtn")
    ?.addEventListener(
        "click",
        async () => {

            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );

                const response =
                    await fetch(
                        "http://127.0.0.1:8000/medicines/download",
                        {
                            method: "GET",
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                if (!response.ok) {

                    throw new Error(
                        `HTTP ${response.status}`
                    );

                }

                const blob =
                    await response.blob();

                const url =
                    window.URL.createObjectURL(
                        blob
                    );

                const a =
                    document.createElement(
                        "a"
                    );

                a.href = url;
                a.download =
                    "medicines.csv";

                document.body.appendChild(
                    a
                );

                a.click();

                a.remove();

                window.URL.revokeObjectURL(
                    url
                );

            } catch (error) {

                console.error(error);

                alert(
                    "CSV download failed"
                );

            }

        }
    );