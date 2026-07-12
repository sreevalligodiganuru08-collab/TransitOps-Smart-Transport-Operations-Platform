(function () {
    "use strict";

    // ==========================
    // Helpers
    // ==========================

    function $(selector) {
        return document.querySelector(selector);
    }

    // ==========================
    // Sidebar
    // ==========================

    const sidebar = $("#sidebar");
    const sidebarToggle = $("#sidebarToggle");
    const sidebarBackdrop = $("#sidebarBackdrop");

    function toggleSidebar() {
        if (sidebar) sidebar.classList.toggle("open");
        if (sidebarBackdrop) sidebarBackdrop.classList.toggle("open");
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", toggleSidebar);
    }

    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener("click", toggleSidebar);
    }

    // ==========================
    // Toast
    // ==========================

    function showToast(message) {
        const toast = $("#toast");

        if (!toast) return;

        toast.innerText = message;
        toast.classList.add("show");

        setTimeout(function () {
            toast.classList.remove("show");
        }, 2500);
    }

    // ==========================
    // Modal
    // ==========================

    function bindModal(openBtnId, modalId) {

        const openBtn = $("#" + openBtnId);
        const modal = $("#" + modalId);

        if (!openBtn || !modal) return;

        openBtn.addEventListener("click", function () {

            modal.classList.add("open");
            document.body.style.overflow = "hidden";

        });

        modal.querySelectorAll("[data-close-modal]").forEach(function (btn) {

            btn.addEventListener("click", function () {

                modal.classList.remove("open");
                document.body.style.overflow = "";

            });

        });

        modal.addEventListener("click", function (e) {

            if (e.target === modal) {

                modal.classList.remove("open");
                document.body.style.overflow = "";

            }

        });

    }

    bindModal("openCreateTripModal", "createTripModal");
    bindModal("openAddMaintenanceModal", "addMaintenanceModal");
    bindModal("openAddFuelModal", "addFuelModal");
    bindModal("openAddExpenseModal", "addExpenseModal");

    // ======================================================
    // Trip Search + Status Filter + Trip Count
    // ======================================================

    const searchInput = $("#tripSearch");
    const statusFilter = $("#statusFilter");
    const tableBody = $("#tripsTableBody");
    const tripCount = $("#tripCount");

    function updateTripTable() {

        if (!tableBody) return;

        const searchValue = searchInput
            ? searchInput.value.toLowerCase()
            : "";

        const selectedStatus = statusFilter
            ? statusFilter.value.toLowerCase()
            : "all";

        const rows = tableBody.querySelectorAll("tr");

        let visible = 0;

        rows.forEach(function (row) {

            // Ignore "No Trips Available" row
            if (row.children.length === 1) {
                row.style.display = "";
                return;
            }

            const status = row.dataset.status || "";

            const matchesStatus =
                selectedStatus === "all" ||
                status === selectedStatus;

            const matchesSearch =
                row.innerText.toLowerCase().includes(searchValue);

            if (matchesStatus && matchesSearch) {

                row.style.display = "";
                visible++;

            } else {

                row.style.display = "none";

            }

        });

        if (tripCount) {
            tripCount.textContent = visible;
        }

    }

    if (searchInput) {
        searchInput.addEventListener("keyup", updateTripTable);
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", updateTripTable);
    }

    updateTripTable();

    // ==========================
    // ESC closes modal
    // ==========================

    document.addEventListener("keydown", function (e) {

        if (e.key === "Escape") {

            document.querySelectorAll(".modal-overlay.open").forEach(function (modal) {

                modal.classList.remove("open");

            });

            document.body.style.overflow = "";

        }

    });

})();

// ======================================================
// Maintenance Search + Status Filter + Count
// ======================================================

const maintenanceSearch = $("#maintenanceSearch");
const maintenanceStatus = $("#maintenanceStatusFilter");
const maintenanceTable = $("#maintenanceTableBody");
const maintenanceCount = $("#maintenanceCount");

function updateMaintenanceTable() {

    if (!maintenanceTable) return;

    const searchValue = maintenanceSearch
        ? maintenanceSearch.value.toLowerCase()
        : "";

    const selectedStatus = maintenanceStatus
        ? maintenanceStatus.value.toLowerCase()
        : "all";

    const rows = maintenanceTable.querySelectorAll("tr");

    let visible = 0;

    rows.forEach(function (row) {

        // Ignore "No Records" row
        if (row.children.length === 1) {
            row.style.display = "";
            return;
        }

        const status = (row.dataset.status || "").toLowerCase();

        const matchesStatus =
            selectedStatus === "all" ||
            status === selectedStatus;

        const matchesSearch =
            row.innerText.toLowerCase().includes(searchValue);

        if (matchesStatus && matchesSearch) {

            row.style.display = "";
            visible++;

        } else {

            row.style.display = "none";

        }

    });

    if (maintenanceCount) {
        maintenanceCount.textContent = visible;
    }

}

if (maintenanceSearch) {
    maintenanceSearch.addEventListener("keyup", updateMaintenanceTable);
}

if (maintenanceStatus) {
    maintenanceStatus.addEventListener("change", updateMaintenanceTable);
}

updateMaintenanceTable();