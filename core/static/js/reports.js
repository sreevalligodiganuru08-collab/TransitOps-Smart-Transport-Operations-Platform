/* ==========================================================================
   TransitOps - Reports & Analytics UI behaviour
   Dummy charts, counters, and client-side CSV export. No API calls.
   ========================================================================== */

(function () {
  "use strict";

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
  /* KPI counter animation                                            */
  /* ---------------------------------------------------------------- */

  function animateCounters() {
    $all("[data-counter]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-target")) || 0;
      var decimals = parseInt(el.getAttribute("data-decimals"), 10) || 0;
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 900;
      var start = null;

      function format(value) {
        var num = decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-IN");
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
  /* Charts (Chart.js) - dummy datasets                                */
  /* ---------------------------------------------------------------- */

  function renderCharts() {
    if (typeof Chart === "undefined") return;

    Chart.defaults.font.family = "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
    Chart.defaults.color = "#6b7280";

    var barCtx = $("#utilizationBarChart");
    if (barCtx) {
      new Chart(barCtx, {
        type: "bar",
        data: {
          labels: ["Van-05", "Van-08", "Truck-12", "Truck-03"],
          datasets: [
            {
              label: "Utilized (days)",
              data: [22, 18, 25, 20],
              backgroundColor: "#2563eb",
              borderRadius: 6,
              maxBarThickness: 34
            },
            {
              label: "Idle (days)",
              data: [8, 12, 5, 10],
              backgroundColor: "#e5e7eb",
              borderRadius: 6,
              maxBarThickness: 34
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { color: "#f3f4f6" } }
          }
        }
      });
    }

    var pieCtx = $("#costPieChart");
    if (pieCtx) {
      new Chart(pieCtx, {
        type: "doughnut",
        data: {
          labels: ["Fuel", "Maintenance", "Tolls & Other"],
          datasets: [
            {
              data: [58, 32, 10],
              backgroundColor: ["#2563eb", "#0ea5e9", "#93c5fd"],
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "62%",
          plugins: { legend: { position: "bottom", labels: { boxWidth: 10, padding: 16 } } }
        }
      });
    }

    var lineCtx = $("#monthlyExpenseChart");
    if (lineCtx) {
      new Chart(lineCtx, {
        type: "line",
        data: {
          labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          datasets: [
            {
              label: "Total Expense (₹)",
              data: [186000, 204500, 195200, 231800, 268400, 284650],
              borderColor: "#2563eb",
              backgroundColor: "rgba(37, 99, 235, 0.12)",
              fill: true,
              tension: 0.35,
              pointRadius: 4,
              pointBackgroundColor: "#2563eb"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: "#f3f4f6" } }
          }
        }
      });
    }
  }

  renderCharts();

  /* ---------------------------------------------------------------- */
  /* Export CSV (client-side, dummy report data)                      */
  /* ---------------------------------------------------------------- */

  var exportCsvBtn = $("#exportCsvBtn");
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener("click", function () {
      var rows = [
        ["Vehicle", "Fleet Utilization (%)", "Fuel Efficiency (km/L)", "Operational Cost (₹)", "Vehicle ROI (%)"],
        ["Van-05", "82", "9.1", "58200", "24.3"],
        ["Van-08", "71", "8.6", "42600", "18.9"],
        ["Truck-12", "88", "6.4", "112400", "22.1"],
        ["Truck-03", "76", "7.9", "71450", "19.7"]
      ];

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

      showToast("Report exported as CSV.", "success");
    });
  }

  /* ---------------------------------------------------------------- */
  /* Export PDF (UI only - triggers browser print dialog)             */
  /* ---------------------------------------------------------------- */

  var exportPdfBtn = $("#exportPdfBtn");
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener("click", function () {
      showToast("Preparing PDF export...", "success");
      setTimeout(function () { window.print(); }, 300);
    });
  }

  /* ---------------------------------------------------------------- */
  /* Recent reports: per-row download (dummy)                         */
  /* ---------------------------------------------------------------- */

  $all(".report-download").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = btn.closest("tr");
      var name = row ? row.querySelector(".report-name span").textContent : "Report";
      showToast('"' + name + '" download started.', "success");
    });
  });
})();
