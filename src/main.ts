import { ChemicalSuppliesTable } from "./components/ChemicalSuppliesTable";
import { initialChemicalSupplies } from "./data";
import { logger } from "./logger";
import "./style.css";
import type { ChemicalSupply } from "./types";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (app === null) throw new Error("App container not found");

  const table = new ChemicalSuppliesTable(initialChemicalSupplies);

  // Add toolbar
  const toolbar = document.createElement("div");
  toolbar.className = "flex space-x-2 mb-4";
  toolbar.innerHTML = `
    <button id="addRow" class="bg-blue-500 text-white p-2 rounded">+</button>
    <button id="moveDown" class="bg-gray-500 text-white p-2 rounded">↓</button>
    <button id="moveUp" class="bg-gray-500 text-white p-2 rounded">↑</button>
    <button id="deleteRow" class="bg-red-500 text-white p-2 rounded">🗑️</button>
    <button id="refresh" class="bg-green-500 text-white p-2 rounded">↻</button>
    <button id="save" class="bg-yellow-500 text-white p-2 rounded">💾</button>
  `;
  app.appendChild(toolbar);

  const tableContainer = document.createElement("div");
  app.appendChild(tableContainer);

  function renderTable() {
    tableContainer.innerHTML = "";
    tableContainer.appendChild(table.getElement());
  }

  renderTable();

  // Add event listeners for toolbar buttons
  document.getElementById("addRow")?.addEventListener("click", () => {
    const newSupply = {
      id: Math.max(...table.getSupplies().map((s) => s.id)) + 1,
      chemicalName: "New Chemical",
      vendor: "New Vendor",
      density: 0,
      viscosity: 0,
      packaging: "N/A",
      packSize: 0,
      unit: "N/A",
      quantity: 0,
    };
    table.addSupply(newSupply);
    renderTable();
  });

  document.getElementById("deleteRow")?.addEventListener("click", () => {
    table.deleteSelectedSupplies();
    renderTable();
  });

  document.getElementById("moveUp")?.addEventListener("click", () => {
    table.moveSelectedSupplies("up");
    renderTable();
  });

  document.getElementById("moveDown")?.addEventListener("click", () => {
    table.moveSelectedSupplies("down");
    renderTable();
  });

  document.getElementById("refresh")?.addEventListener("click", () => {
    table.reset();
    renderTable();
    logger.info("Table refreshed");
  });

  document.getElementById("save")?.addEventListener("click", () => {
    try {
      const updatedSupplies = table.getSupplies();
      // Validate all supplies before saving
      for (const supply of updatedSupplies) {
        for (const [key, value] of Object.entries(supply)) {
          table.parseAndValidateValue(
            key as keyof ChemicalSupply,
            String(value),
          );
        }
      }
      // In a real application, I will send updatedSupplies to a backend
      console.log("Updated supplies:", updatedSupplies);
      logger.info("Data saved (simulated)");
      alert("Data saved successfully!");
    } catch (error) {
      alert(`Failed to save data: ${(error as { message: string }).message}`);
    }
  });

  logger.info("Application initialized");

  function showOfflineWarning() {
    if (app === null) {
      throw new Error("App is still not defined");
    }

    const warning = document.createElement("div");

    warning.textContent =
      "You are currently offline. Some features may be limited.";
    warning.className =
      "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4";
    app.insertBefore(warning, app.firstChild);
  }

  function removeOfflineWarning() {
    const warning = document.querySelector(".bg-yellow-100");
    if (warning) {
      warning.remove();
    }
  }

  window.addEventListener("online", () => {
    removeOfflineWarning();
    logger.info("Application is back online");
  });

  window.addEventListener("offline", () => {
    showOfflineWarning();
    logger.info("Application is offline");
  });

  if (!navigator.onLine) {
    showOfflineWarning();
  }
});

// Setup for PWA support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered successfully:", registration);
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
  });
}
