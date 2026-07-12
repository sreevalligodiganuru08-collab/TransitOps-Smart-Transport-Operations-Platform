/* ==========================================================================
   TransitOps - Reports & Analytics page behaviour
   Charts and CSV export driven by real data passed in via window.* globals
   (set inline in reports.html from the Django context). No API calls.
   ========================================================================== */

(function () {
  "use strict";

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  /* ---------------------------------------------------------------- */
  /* KPI counter animation                                            */
  /* ---------------------------------------------------------------- */

  function animateCounters() {
    $all("[data-counter]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-target")) || 0;
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      var hasDecimals = target % 1 !== 0;
      var duration = 900;
      var start = null;

      function format(value) {
        var num = hasDecimals ? value.toFixed(1) : Math.round(value).toLocaleString("en-IN");
        return prefix + num + suffix;
      }

      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = format(target * eased);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = format(target);
      }

      requestAnimationFrame(step);
    });
  }

  animateCounters();

  /* ---------------------------------------------------------------- */
  /* Charts (Chart.js) - fed by real data from window.*                */
  /* ---------------------------------------------------------------- */

  function groupByMonth(entries) {
    var buckets = {};
    entries.forEach(function (entry) {
      if (!entry.date) return;
      var month = entry.date.slice(0, 7);
      buckets[month] = (buckets[month] || 0) + (parseFloat(entry.amount) || 0);
    });
    var months = Object.keys(buckets).sort();
    return {
      labels: months.map(function (m) {
        var d = new Date(m + "-01");
        return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      }),
      data: months.map(function (m) { return buckets[m]; })
    };
  }

  function renderCharts() {
    if (typeof Chart === "undefined") return;

    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = "#64748b";

    var statusCounts = window.vehicleStatusCounts || { available: 0, inTransit: 0, maintenance: 0 };
    var barCtx = $("#vehicleStatusBarChart");
    if (barCtx) {
      new Chart(barCtx, {
        type: "bar",
        data: {
          labels: ["Available", "In Transit", "Maintenance"],
          datasets: [{
            data: [statusCounts.available, statusCounts.inTransit, statusCounts.maintenance],
            backgroundColor: ["#16a34a", "#2563eb", "#f59e0b"],
            borderRadius: 6,
            maxBarThickness: 48
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, ticks: { precision: 0 } }
          }
        }
      });
    }

    var costs = window.costBreakdown || { fuel: 0, maintenance: 0, expenses: 0 };
    var pieCtx = $("#costPieChart");
    if (pieCtx) {
      new Chart(pieCtx, {
        type: "doughnut",
        data: {
          labels: ["Fuel", "Maintenance", "Other Expenses"],
          datasets: [{
            data: [costs.fuel, costs.maintenance, costs.expenses],
            backgroundColor: ["#2563eb", "#c2410c", "#7c3aed"],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "62%",
          plugins: { legend: { display: false } }
        }
      });
    }

    var monthly = groupByMonth(window.costEntries || []);
    var lineCtx = $("#monthlyExpenseChart");
    if (lineCtx) {
      new Chart(lineCtx, {
        type: "line",
        data: {
          labels: monthly.labels,
          datasets: [{
            label: "Total Expense (₹)",
            data: monthly.data,
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.12)",
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: "#2563eb"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: "#f1f5f9" } }
          }
        }
      });
    }
  }

  renderCharts();

  /* ---------------------------------------------------------------- */
  /* Export CSV (real vehicle summary data)                            */
  /* ---------------------------------------------------------------- */

  var exportCsvBtn = $("#exportCsvBtn");
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener("click", function () {
      var vehicles = window.vehicleSummary || [];
      var rows = [["Registration Number", "Status", "Max Capacity (kg)", "Acquisition Cost (₹)"]];
      vehicles.forEach(function (v) {
        rows.push([v.registration, v.status, v.capacity, v.acquisitionCost]);
      });

      var csvContent = rows.map(function (row) {
        return row.map(function (cell) { return '"' + String(cell).replace(/"/g, '""') + '"'; }).join(",");
      }).join("\r\n");

      var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transitops-report-" + new Date().toISOString().slice(0, 10) + ".csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  /* ---------------------------------------------------------------- */
  /* Export PDF (UI only - triggers browser print dialog)             */
  /* ---------------------------------------------------------------- */

  var exportPdfBtn = $("#exportPdfBtn");
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener("click", function () {
      window.print();
    });
  }
})();
