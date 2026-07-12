/* ==========================================================================
   TransitOps - Trip / Maintenance / Expense UI behaviour
   Static/dummy data only - no backend calls.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------- */
  /* Helpers                                                          */
  /* ---------------------------------------------------------------- */

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function showToast(message, type) {
    var toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.className = "toast show" + (type ? " " + type : "");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      toast.className = "toast";
    }, 2600);
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

  function badge(status, label) {
    return '<span class="badge badge-' + status + '">' + label + "</span>";
  }

  /* ---------------------------------------------------------------- */
  /* Sidebar toggle (mobile)                                          */
  /* ---------------------------------------------------------------- */

  var sidebar = $("#sidebar");
  var sidebarToggle = $("#sidebarToggle");
  var sidebarBackdrop = $("#sidebarBackdrop");

  function toggleSidebar(open) {
    if (!sidebar) return;
    var shouldOpen = typeof open === "boolean" ? open : !sidebar.classList.contains("open");
    sidebar.classList.toggle("open", shouldOpen);
    if (sidebarBackdrop) sidebarBackdrop.classList.toggle("open", shouldOpen);
  }

  if (sidebarToggle) sidebarToggle.addEventListener("click", function () { toggleSidebar(); });
  if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", function () { toggleSidebar(false); });

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

  bindModal("openCreateTripModal", "createTripModal");
  bindModal("openAddMaintenanceModal", "addMaintenanceModal");
  bindModal("openAddFuelModal", "addFuelModal");
  bindModal("openAddExpenseModal", "addExpenseModal");

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      $all(".modal-overlay.open").forEach(closeModal);
    }
  });

  /* ---------------------------------------------------------------- */
  /* Generic search + status filter for a table                       */
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
    applyFilter();
  }

  wireTableFilter("tripSearch", "statusFilter", "tripsTableBody", "tripCount");
  wireTableFilter("maintenanceSearch", "maintenanceStatusFilter", "maintenanceTableBody", "maintenanceCount");
  wireTableFilter("fuelSearch", null, "fuelTableBody", "fuelCount");
  wireTableFilter("expenseSearch", null, "expenseTableBody", "expenseCount");

  /* ---------------------------------------------------------------- */
  /* Trip counter helper (re-run after DOM mutation)                  */
  /* ---------------------------------------------------------------- */

  function refreshCount(tbodyId, countId) {
    var tbody = $("#" + tbodyId);
    var countEl = $("#" + countId);
    if (!tbody || !countEl) return;
    var visible = $all("tr", tbody).filter(function (r) { return r.style.display !== "none"; });
    countEl.textContent = visible.length;
  }

  /* ---------------------------------------------------------------- */
  /* Trips: create trip form (Draft / Dispatch) + cargo validation     */
  /* ---------------------------------------------------------------- */

  var createTripForm = $("#createTripForm");
  if (createTripForm) {
    var tripVehicleSelect = $("#vehicle");
    var tripCargoInput = $("#cargo_weight");
    var tripStatusInput = $("#status");
    var cargoGroup = tripCargoInput ? tripCargoInput.closest(".form-group") : null;
    var tripCounter = 1005;
    var submitMode = "dispatch";

    $all('button[type="submit"]', createTripForm).forEach(function (btn) {
      btn.addEventListener("click", function () {
        submitMode = btn.getAttribute("data-mode") || "dispatch";
        if (tripStatusInput) tripStatusInput.value = submitMode === "draft" ? "draft" : "dispatched";
      });
    });

    function validateCargo() {
      if (!tripVehicleSelect || !tripCargoInput || !cargoGroup) return true;
      var selectedOption = tripVehicleSelect.options[tripVehicleSelect.selectedIndex];
      var capacity = selectedOption ? parseFloat(selectedOption.getAttribute("data-capacity")) : NaN;
      var cargo = parseFloat(tripCargoInput.value);

      if (!isNaN(capacity) && !isNaN(cargo) && cargo > capacity) {
        cargoGroup.classList.add("has-error");
        return false;
      }
      cargoGroup.classList.remove("has-error");
      return true;
    }

    if (tripCargoInput) tripCargoInput.addEventListener("input", validateCargo);
    if (tripVehicleSelect) tripVehicleSelect.addEventListener("change", validateCargo);

    createTripForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!createTripForm.checkValidity()) {
        createTripForm.reportValidity();
        return;
      }
      if (!validateCargo()) {
        showToast("Cargo weight exceeds the selected vehicle's maximum load capacity.", "error");
        return;
      }

      var source = $("#source").value.trim();
      var destination = $("#destination").value.trim();
      var vehicle = tripVehicleSelect.value;
      var driver = $("#driver").value;
      var cargo = tripCargoInput.value;
      var distance = $("#planned_distance").value;

      var status = submitMode === "draft" ? "draft" : "dispatched";
      var statusLabel = submitMode === "draft" ? "Draft" : "Dispatched";
      var tripId = "TRP-" + (tripCounter++);

      var actionsHtml = status === "dispatched"
        ? '<div class="row-actions">' +
            '<button type="button" class="btn-icon action-complete" title="Complete trip" data-id="' + tripId + '">' +
              '<svg class="icon" viewBox="0 0 24 24"><path d="M5 12l5 5L20 6"/></svg></button>' +
            '<button type="button" class="btn-icon danger action-cancel" title="Cancel trip" data-id="' + tripId + '">' +
              '<svg class="icon" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
          "</div>"
        : '<div class="row-actions">' +
            '<button type="button" class="btn-icon action-dispatch" title="Dispatch trip" data-id="' + tripId + '">' +
              '<svg class="icon" viewBox="0 0 24 24"><path d="M5 4l14 8-14 8V4z"/></svg></button>' +
            '<button type="button" class="btn-icon danger action-cancel" title="Cancel trip" data-id="' + tripId + '">' +
              '<svg class="icon" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
          "</div>";

      var row = document.createElement("tr");
      row.setAttribute("data-status", status);
      row.innerHTML =
        "<td class=\"cell-strong\">" + tripId + "</td>" +
        "<td>" + source + "</td>" +
        "<td>" + destination + "</td>" +
        "<td>" + vehicle + "</td>" +
        "<td>" + driver + "</td>" +
        "<td>" + cargo + " kg</td>" +
        "<td>" + distance + " km</td>" +
        "<td>" + badge(status, statusLabel) + "</td>" +
        "<td>" + actionsHtml + "</td>";

      var tbody = $("#tripsTableBody");
      tbody.insertBefore(row, tbody.firstChild);

      refreshCount("tripsTableBody", "tripCount");
      closeModal($("#createTripModal"));
      createTripForm.reset();
      if (cargoGroup) cargoGroup.classList.remove("has-error");

      showToast(
        status === "dispatched"
          ? "Trip " + tripId + " dispatched. Vehicle & driver marked On Trip."
          : "Trip " + tripId + " saved as draft.",
        "success"
      );
    });
  }

  /* ---------------------------------------------------------------- */
  /* Trips: row actions (dispatch / complete / cancel)                */
  /* ---------------------------------------------------------------- */

  var tripsTableBody = $("#tripsTableBody");
  if (tripsTableBody) {
    tripsTableBody.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      var row = btn.closest("tr");
      var tripId = btn.getAttribute("data-id");
      var statusCell = row.querySelector("td:nth-child(8)");
      var actionsCell = row.querySelector("td:nth-child(9)");

      if (btn.classList.contains("action-dispatch")) {
        row.setAttribute("data-status", "dispatched");
        statusCell.innerHTML = badge("dispatched", "Dispatched");
        actionsCell.innerHTML =
          '<div class="row-actions">' +
            '<button type="button" class="btn-icon action-complete" title="Complete trip" data-id="' + tripId + '">' +
              '<svg class="icon" viewBox="0 0 24 24"><path d="M5 12l5 5L20 6"/></svg></button>' +
            '<button type="button" class="btn-icon danger action-cancel" title="Cancel trip" data-id="' + tripId + '">' +
              '<svg class="icon" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
          "</div>";
        showToast("Trip " + tripId + " dispatched. Vehicle & driver marked On Trip.", "success");
      } else if (btn.classList.contains("action-complete")) {
        row.setAttribute("data-status", "completed");
        statusCell.innerHTML = badge("completed", "Completed");
        actionsCell.innerHTML = '<div class="row-actions"><span class="cell-muted">No actions</span></div>';
        showToast("Trip " + tripId + " completed. Vehicle & driver marked Available.", "success");
      } else if (btn.classList.contains("action-cancel")) {
        row.setAttribute("data-status", "cancelled");
        statusCell.innerHTML = badge("cancelled", "Cancelled");
        actionsCell.innerHTML = '<div class="row-actions"><span class="cell-muted">No actions</span></div>';
        showToast("Trip " + tripId + " cancelled. Vehicle & driver restored to Available.", "error");
      } else {
        return;
      }

      var statusFilter = $("#statusFilter");
      if (statusFilter) {
        var event = new Event("change");
        statusFilter.dispatchEvent(event);
      }
    });
  }

  /* ---------------------------------------------------------------- */
  /* Maintenance: add record form                                     */
  /* ---------------------------------------------------------------- */

  var addMaintenanceForm = $("#addMaintenanceForm");
  if (addMaintenanceForm) {
    addMaintenanceForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!addMaintenanceForm.checkValidity()) {
        addMaintenanceForm.reportValidity();
        return;
      }

      var vehicle = $("#vehicle").value;
      var type = $("#maintenance_type").value.trim();
      var date = $("#maintenance_date").value;
      var cost = parseFloat($("#cost").value) || 0;
      var status = $("#status").value;
      var statusLabel = status === "completed" ? "Completed" : "In Progress";

      var actionsHtml = status === "completed"
        ? '<div class="row-actions"><span class="cell-muted">Vehicle available</span></div>'
        : '<div class="row-actions"><button type="button" class="btn-icon action-close-maintenance" title="Mark completed" data-vehicle="' + vehicle + '">' +
            '<svg class="icon" viewBox="0 0 24 24"><path d="M5 12l5 5L20 6"/></svg></button></div>';

      var row = document.createElement("tr");
      row.setAttribute("data-status", status);
      row.innerHTML =
        "<td class=\"cell-strong\">" + vehicle + "</td>" +
        "<td>" + type + "</td>" +
        "<td>" + date + "</td>" +
        "<td>₹" + cost.toLocaleString("en-IN") + "</td>" +
        "<td>" + badge(status, statusLabel) + "</td>" +
        "<td>" + actionsHtml + "</td>";

      var tbody = $("#maintenanceTableBody");
      tbody.insertBefore(row, tbody.firstChild);
      refreshCount("maintenanceTableBody", "maintenanceCount");

      closeModal($("#addMaintenanceModal"));
      addMaintenanceForm.reset();

      showToast(
        status === "completed"
          ? "Maintenance logged for " + vehicle + "."
          : vehicle + " status switched to In Shop and hidden from dispatch.",
        "success"
      );
    });
  }

  var maintenanceTableBody = $("#maintenanceTableBody");
  if (maintenanceTableBody) {
    maintenanceTableBody.addEventListener("click", function (e) {
      var btn = e.target.closest(".action-close-maintenance");
      if (!btn) return;
      var row = btn.closest("tr");
      var vehicle = btn.getAttribute("data-vehicle");
      row.setAttribute("data-status", "completed");
      row.querySelector("td:nth-child(5)").innerHTML = badge("completed", "Completed");
      row.querySelector("td:nth-child(6)").innerHTML = '<div class="row-actions"><span class="cell-muted">Vehicle available</span></div>';
      showToast(vehicle + " maintenance closed. Vehicle restored to Available.", "success");

      var statusFilter = $("#maintenanceStatusFilter");
      if (statusFilter) statusFilter.dispatchEvent(new Event("change"));
    });
  }

  /* ---------------------------------------------------------------- */
  /* Expenses: add fuel record + add expense form                     */
  /* ---------------------------------------------------------------- */

  var addFuelForm = $("#addFuelForm");
  if (addFuelForm) {
    addFuelForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!addFuelForm.checkValidity()) {
        addFuelForm.reportValidity();
        return;
      }
      var vehicle = $("#fuel_vehicle").value;
      var litres = parseFloat($("#fuel_litres").value) || 0;
      var cost = parseFloat($("#fuel_cost").value) || 0;
      var date = $("#fuel_date").value;

      var row = document.createElement("tr");
      row.innerHTML =
        "<td class=\"cell-strong\">" + vehicle + "</td>" +
        "<td>" + litres.toFixed(1) + " L</td>" +
        "<td>₹" + cost.toLocaleString("en-IN") + "</td>" +
        "<td>" + date + "</td>";

      var tbody = $("#fuelTableBody");
      tbody.insertBefore(row, tbody.firstChild);
      refreshCount("fuelTableBody", "fuelCount");

      closeModal($("#addFuelModal"));
      addFuelForm.reset();
      showToast("Fuel record added for " + vehicle + ".", "success");
    });
  }

  var addExpenseForm = $("#addExpenseForm");
  if (addExpenseForm) {
    addExpenseForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!addExpenseForm.checkValidity()) {
        addExpenseForm.reportValidity();
        return;
      }
      var vehicle = $("#expense_vehicle").value;
      var type = $("#expense_type").value;
      var amount = parseFloat($("#amount").value) || 0;
      var date = $("#expense_date").value;

      var row = document.createElement("tr");
      row.innerHTML =
        "<td class=\"cell-strong\">" + vehicle + "</td>" +
        "<td><span class=\"badge badge-neutral\">" + type + "</span></td>" +
        "<td>₹" + amount.toLocaleString("en-IN") + "</td>" +
        "<td>" + date + "</td>";

      var tbody = $("#expenseTableBody");
      tbody.insertBefore(row, tbody.firstChild);
      refreshCount("expenseTableBody", "expenseCount");

      closeModal($("#addExpenseModal"));
      addExpenseForm.reset();
      showToast(type + " expense added for " + vehicle + ".", "success");
    });
  }

  /* ---------------------------------------------------------------- */
  /* Initial counts on page load                                      */
  /* ---------------------------------------------------------------- */

  ["tripsTableBody:tripCount", "maintenanceTableBody:maintenanceCount", "fuelTableBody:fuelCount", "expenseTableBody:expenseCount"]
    .forEach(function (pair) {
      var parts = pair.split(":");
      refreshCount(parts[0], parts[1]);
    });
})();
