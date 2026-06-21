/* ============================================================
   MOBISTRO — Pricing page charts (Chart.js)
   ROI / break-even calculator + comparison + market trend
   ============================================================ */
(function () {
  "use strict";
  if (typeof Chart === "undefined") return;

  const EMBER = "#E0633C", BRASS = "#C2A056", MUT = "#6B6157", CMUT = "#B3A99B";
  const LINE = "rgba(42,36,29,.10)", LINEC = "rgba(244,239,231,.12)";
  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  Chart.defaults.font.size = 12;

  const eur = n => { try { return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n); } catch (e) { return "€" + n; } };
  const $ = id => document.getElementById(id);
  const val = id => { const e = $(id); return e ? +e.value : 0; };
  const setText = (id, t) => { const e = $(id); if (e) e.textContent = t; };

  let roiChart;

  function initROI() {
    const ctx = $("roiChart"); if (!ctx) return;
    roiChart = new Chart(ctx, {
      type: "line",
      data: { labels: [], datasets: [
        { label: "Kumulierter Gewinn", data: [], borderColor: EMBER, backgroundColor: "rgba(224,99,60,.12)", fill: true, tension: .25, pointRadius: 0, borderWidth: 3 },
        { label: "Investition", data: [], borderColor: BRASS, borderDash: [6, 5], pointRadius: 0, borderWidth: 2, fill: false }
      ]},
      options: {
        responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: "index" },
        plugins: {
          legend: { display: true, position: "top", labels: { color: MUT, boxWidth: 12, usePointStyle: true, pointStyle: "line" } },
          tooltip: { callbacks: { title: items => items[0].label + ". Monat", label: c => c.dataset.label + ": " + eur(c.parsed.y) } }
        },
        scales: {
          x: { grid: { color: LINE }, ticks: { color: MUT, maxTicksLimit: 13 }, title: { display: true, text: "Monate ab Start", color: MUT } },
          y: { grid: { color: LINE }, ticks: { color: MUT, callback: v => (v / 1000) + "k €" } }
        }
      }
    });
    ["roiBase", "roiCust", "roiTicket", "roiDays", "roiMargin"].forEach(id => { const el = $(id); if (el) el.addEventListener("input", updateROI); });
    updateROI();
  }

  function updateROI() {
    const base = val("roiBase"), cust = val("roiCust"), ticket = val("roiTicket"), days = val("roiDays"), margin = val("roiMargin");
    setText("roiBaseVal", eur(base));
    setText("roiCustVal", cust);
    setText("roiTicketVal", ticket + " €");
    setText("roiDaysVal", days);
    setText("roiMarginVal", margin + " %");
    const rev = cust * ticket * days * 4.33;
    const profit = rev * (margin / 100);
    setText("roiRev", eur(Math.round(rev)));
    setText("roiProfit", eur(Math.round(profit)));
    const be = profit > 0 ? Math.ceil(base / profit) : 999;
    setText("roiBreakeven", be <= 1 ? "1 Monat" : (be <= 36 ? be + " Monaten" : "> 3 Jahren"));
    const labels = [], cum = [], inv = [];
    for (let m = 0; m <= 36; m++) { labels.push(m); cum.push(Math.round(profit * m)); inv.push(base); }
    roiChart.data.labels = labels;
    roiChart.data.datasets[0].data = cum;
    roiChart.data.datasets[1].data = inv;
    roiChart.update();
  }

  function initCmp() {
    const ctx = $("cmpChart"); if (!ctx) return;
    new Chart(ctx, {
      type: "bar",
      data: { labels: ["Eigenbau / DIY", "Mobistro"], datasets: [{ label: "Wochen bis zum Launch", data: [20, 6], backgroundColor: ["rgba(244,239,231,.22)", EMBER], borderRadius: 8, barThickness: 50 }] },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: "y",
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => c.parsed.x + " Wochen" } } },
        scales: {
          x: { grid: { color: LINEC }, ticks: { color: CMUT, callback: v => v + " Wo" }, beginAtZero: true },
          y: { grid: { display: false }, ticks: { color: "#fff", font: { weight: 600, size: 13 } } }
        }
      }
    });
  }

  function initMkt() {
    const ctx = $("mktChart"); if (!ctx) return;
    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034"],
        datasets: [{ label: "Marktvolumen Europa (Mrd. €)", data: [1.35, 1.43, 1.51, 1.60, 1.69, 1.78, 1.89, 1.99, 2.11, 2.22], borderColor: EMBER, backgroundColor: "rgba(224,99,60,.16)", fill: true, tension: .35, pointRadius: 0, borderWidth: 3 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => c.parsed.y.toFixed(2) + " Mrd. €" } } },
        scales: {
          x: { grid: { color: LINEC }, ticks: { color: CMUT } },
          y: { grid: { color: LINEC }, ticks: { color: CMUT, callback: v => v + " Mrd" } }
        }
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => { initROI(); initCmp(); initMkt(); });
})();
