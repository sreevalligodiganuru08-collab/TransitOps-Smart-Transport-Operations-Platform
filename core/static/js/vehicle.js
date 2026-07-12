/* ==========================================================================
   TransitOps - Vehicle / Driver list page behaviour
   Real Django-rendered rows. Only client-side interactions here:
   modal open/close, search/filter, and a delete confirmation guard.
   No fetch/AJAX/API calls.
   ========================================================================== */

(function () {
  "use strict";

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

  bindModal("openAddVehicleModal", "addVehicleModal");
  bindModal("openAddDriverModal", "addDriverModal");

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
        if (!row.hasAttribute("data-status")) return;
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

  wireTableFilter("vehicleSearch", "vehicleStatusFilter", "vehiclesTableBody", "vehicleCount");
  wireTableFilter("driverSearch", "driverStatusFilter", "driversTableBody", "driverCount");

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
})();
