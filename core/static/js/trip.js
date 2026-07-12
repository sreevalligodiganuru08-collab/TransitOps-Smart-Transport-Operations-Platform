<<<<<<< HEAD
=======
/* ==========================================================================
   TransitOps - Trip / Maintenance / Fuel / Expense page behaviour
   Real Django-rendered rows and real form POSTs. Only client-side
   interactions here: modal open/close, search/filter, cargo-vs-capacity
   validation, and a delete confirmation guard. No fetch/AJAX/API calls.
   ========================================================================== */

>>>>>>> 5b98f44eabf571389fa792b27c0342d21238fc71
(function () {
    "use strict";

<<<<<<< HEAD
    // ==========================
    // Helpers
    // ==========================

    function $(selector) {
        return document.querySelector(selector);
    }

    // ==========================
    // Sidebar
    // ==========================
=======
  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---------------------------------------------------------------- */
  /* Generic modal open / close bindings                              */
  /* ---------------------------------------------------------------- */

  function bindModal(openBtnId, modalId) {
    var openBtn = $("#" + openBtnId);
    var modal = $("#" + modalId);
    if (!openBtn || !modal) return;

    openBtn.addEventListener("click", function () { openModal(modal); });
    $all("[data-close-modal]", modal).forEach(function (btn) {
      btn.addEventListener("click", function () { closeModal(modal); });
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal(modal);
    });
  }

  bindModal("openAddTripModal", "addTripModal");
  bindModal("openAddMaintenanceModal", "addMaintenanceModal");
  bindModal("openAddFuelModal", "addFuelModal");
  bindModal("openAddExpenseModal", "addExpenseModal");

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      $all(".modal-overlay.open").forEach(closeModal);
    }
  });

  /* ---------------------------------------------------------------- */
  /* Search + status filter for a table                               */
  /* ---------------------------------------------------------------- */

  function wireTableFilter(searchInputId, statusSelectId, tbodyId, countId) {
    var searchInput = $("#" + searchInputId);
    var statusSelect = statusSelectId ? $("#" + statusSelectId) : null;
    var tbody = $("#" + tbodyId);
    if (!tbody) return;

    function applyFilter() {
      var term = (searchInput ? searchInput.value : "").trim().toLowerCase();
      var status = statusSelect ? statusSelect.value : "all";
      var visibleCount = 0;

      $all("tr", tbody).forEach(function (row) {
        if (!row.hasAttribute("data-status") && statusSelect) return;
        var text = row.textContent.toLowerCase();
        var matchesText = !term || text.indexOf(term) !== -1;
        var matchesStatus = !status || status === "all" || row.getAttribute("data-status") === status;
        var show = matchesText && matchesStatus;
        row.style.display = show ? "" : "none";
        if (show) visibleCount++;
      });

      if (countId) {
        var countEl = $("#" + countId);
        if (countEl) countEl.textContent = visibleCount;
      }
    }

    if (searchInput) searchInput.addEventListener("input", applyFilter);
    if (statusSelect) statusSelect.addEventListener("change", applyFilter);
  }
>>>>>>> 5b98f44eabf571389fa792b27c0342d21238fc71

    const sidebar = $("#sidebar");
    const sidebarToggle = $("#sidebarToggle");
    const sidebarBackdrop = $("#sidebarBackdrop");

<<<<<<< HEAD
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

=======
  /* ---------------------------------------------------------------- */
  /* Cargo weight vs vehicle capacity validation (Create/Edit Trip)   */
  /* ---------------------------------------------------------------- */

  function wireCargoValidation(vehicleSelectId, cargoInputId, errorElId) {
    var vehicleSelect = $("#" + vehicleSelectId);
    var cargoInput = $("#" + cargoInputId);
    var errorEl = $("#" + errorElId);
    if (!vehicleSelect || !cargoInput) return;

    var group = cargoInput.closest(".form-group");

    function validate() {
      var selectedOption = vehicleSelect.options[vehicleSelect.selectedIndex];
      var capacity = selectedOption ? parseFloat(selectedOption.getAttribute("data-capacity")) : NaN;
      var cargo = parseFloat(cargoInput.value);

      if (!isNaN(capacity) && !isNaN(cargo) && cargo > capacity) {
        if (group) group.classList.add("has-error");
        if (errorEl) errorEl.style.display = "block";
        return false;
      }
      if (group) group.classList.remove("has-error");
      if (errorEl) errorEl.style.display = "none";
      return true;
    }

    cargoInput.addEventListener("input", validate);
    vehicleSelect.addEventListener("change", validate);

    var form = cargoInput.closest("form");
    if (form) {
      form.addEventListener("submit", function (e) {
        if (!validate()) {
          e.preventDefault();
        }
      });
    }
  }

  wireCargoValidation("new_vehicle", "new_cargo_weight", "newCargoError");
  wireCargoValidation("vehicle", "cargo_weight", "cargoError");

  /* ---------------------------------------------------------------- */
  /* Delete confirmation guard                                        */
  /* ---------------------------------------------------------------- */

  $all(".delete-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var message = link.getAttribute("data-confirm") || "Delete this record? This cannot be undone.";
      if (!window.confirm(message)) {
        e.preventDefault();
      }
    });
  });
>>>>>>> 5b98f44eabf571389fa792b27c0342d21238fc71
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