import type { ChemicalSupply } from "../types";
import { logger } from "../logger";

export class ChemicalSuppliesTable {
  private supplies: ChemicalSupply[];
  private tableElement: HTMLTableElement;
  private initialSupplies: ChemicalSupply[];
  private currentSort: {
    column: keyof ChemicalSupply;
    direction: "asc" | "desc";
  } | null = null;

  constructor(supplies: ChemicalSupply[]) {
    this.initialSupplies = JSON.parse(JSON.stringify(supplies)); // Deep copy of initial supplies
    this.supplies = JSON.parse(JSON.stringify(supplies));
    this.createTable();
  }

  private createTable() {
    this.tableElement = document.createElement("table");
    this.tableElement.className =
      "w-full border-collapse border border-gray-300";
    this.render();
  }

  public reset() {
    this.supplies = JSON.parse(JSON.stringify(this.initialSupplies)); // Reset to the initial state
    this.currentSort = null; // Reset sorting
    this.createTable(); // Recreate the entire table
    logger.info("Table reset to initial state");
  }

  private render() {
    this.tableElement.innerHTML = `
      <thead>
        <tr>
          <th class="p-2 border border-gray-300"><input type="checkbox" id="selectAll"></th>
          ${Object.keys(this.supplies[0])
        .filter((key) => key !== "selected" && key !== "id")
        .map(
          (key) =>
            `<th class="p-2 border border-gray-300 cursor-pointer" data-sort="${key}">
              ${key.charAt(0).toUpperCase() + key.slice(1)}
              ${this.getSortIndicator(key as keyof ChemicalSupply)}
            </th>`,
        )
        .join("")}
        </tr>
      </thead>
      <tbody>
        ${this.supplies
        .map(
          (supply) => `
          <tr class="${supply.selected ? "bg-blue-100" : ""}">
            <td class="p-2 border border-gray-300"><input type="checkbox" ${supply.selected ? "checked" : ""} data-id="${supply.id}"></td>
            ${Object.entries(supply)
              .filter(([key]) => key !== "selected" && key !== "id")
              .map(
                ([key, value]) =>
                  `<td class="p-2 border border-gray-300" data-id="${supply.id}" data-key="${key}">${value}</td>`,
              )
              .join("")}
          </tr>
        `,
        )
        .join("")}
      </tbody>
    `;

    this.addEventListeners();
  }

  private getSortIndicator(column: keyof ChemicalSupply): string {
    if (this.currentSort && this.currentSort.column === column) {
      return this.currentSort.direction === "asc" ? "▲" : "▼";
    }
    return "";
  }

  private addEventListeners() {
    const sortHeaders = this.tableElement.querySelectorAll("th[data-sort]");
    for (const th of sortHeaders) {
      th.addEventListener("click", () =>
        this.sortTable(th.getAttribute("data-sort") as keyof ChemicalSupply),
      );
    }

    const editableCells = this.tableElement.querySelectorAll(
      "td[data-id][data-key]",
    );
    for (const td of editableCells) {
      td.addEventListener("dblclick", () =>
        this.makeEditable(td as HTMLTableCellElement),
      );
    }

    const selectAllCheckbox = this.tableElement.querySelector("#selectAll");
    selectAllCheckbox?.addEventListener("change", (e) => {
      const checked = (e.target as HTMLInputElement).checked;
      for (const supply of this.supplies) {
        supply.selected = checked;
      }
      this.render();
    });

    const rowCheckboxes = this.tableElement.querySelectorAll(
      'input[type="checkbox"][data-id]',
    );
    for (const checkbox of rowCheckboxes) {
      checkbox.addEventListener("change", (e) => {
        const id = Number.parseInt(
          (e.target as HTMLInputElement).getAttribute("data-id") || "",
        );
        const supply = this.supplies.find((s) => s.id === id);
        if (supply) {
          supply.selected = (e.target as HTMLInputElement).checked;
          this.render();
        }
      });
    }
  }

  private sortTable(column: keyof ChemicalSupply) {
    if (this.currentSort && this.currentSort.column === column) {
      this.currentSort.direction =
        this.currentSort.direction === "asc" ? "desc" : "asc";
    } else {
      this.currentSort = { column, direction: "asc" };
    }

    this.supplies.sort((a, b) => {
      if (a[column] && b[column] && a[column] < b[column])
        return this.currentSort && this.currentSort.direction === "asc"
          ? -1
          : 1;
      if (a[column] && b[column] && a[column] > b[column])
        return this.currentSort && this.currentSort.direction === "asc"
          ? 1
          : -1;
      return 0;
    });

    this.render();
    logger.info(
      `Table sorted by ${column} in ${this.currentSort.direction}ending order`,
    );
  }

  private makeEditable(td: HTMLTableCellElement) {
    const originalValue = td.textContent;
    const input = document.createElement("input");
    input.value = originalValue || "";
    input.className = "w-full p-1";
    td.textContent = "";
    td.appendChild(input);
    input.focus();

    const updateValue = () => {
      const newValue = input.value;
      const id = Number.parseInt(td.getAttribute("data-id") || "");
      const key = td.getAttribute("data-key") as keyof ChemicalSupply;

      try {
        const parsedValue = this.parseAndValidateValue(key, newValue);
        const supplyIndex = this.supplies.findIndex((s) => s.id === id);
        if (supplyIndex !== -1) {
          this.supplies[supplyIndex][key] = parsedValue as never;
          td.textContent = String(parsedValue);
          logger.info(
            `Updated ${key} for chemical ${this.supplies[supplyIndex].chemicalName} to ${parsedValue}`,
          );
        }
      } catch (error) {
        alert((error as { message: string }).message);
        td.textContent = originalValue;
      }
    };

    input.addEventListener("blur", updateValue);

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        updateValue();
        input.blur();
      }
    });
  }

  public parseAndValidateValue(key: keyof ChemicalSupply, value: string) {
    switch (key) {
      case "id": {
        const id = Number.parseInt(value);
        if (Number.isNaN(id) || id <= 0) {
          throw new Error("ID must be a positive integer.");
        }
        return id;
      }
      case "density":
      case "viscosity":
      case "packSize":
      case "quantity": {
        const num = Number.parseFloat(value);
        if (Number.isNaN(num) || num < 0) {
          throw new Error(`${key} must be a non-negative number.`);
        }
        return num;
      }
      case "chemicalName":
      case "vendor":
      case "packaging":
      case "unit": {
        if (value.trim() === "") {
          throw new Error(`${key} cannot be empty.`);
        }
        return value;
      }
      default:
        return value;
    }
  }

  public addSupply(supply: ChemicalSupply) {
    try {
      for (const [key, value] of Object.entries(supply)) {
        this.parseAndValidateValue(key as keyof ChemicalSupply, String(value));
      }
      this.supplies.push(supply);
      this.render();
      logger.info(`Added new supply: ${supply.chemicalName}`);
    } catch (error) {
      alert(
        `Failed to add new supply: ${(error as { message: string }).message}`,
      );
    }
  }

  public deleteSelectedSupplies() {
    this.supplies = this.supplies.filter((supply) => !supply.selected);
    this.render();
    logger.info("Deleted selected supplies");
  }

  public moveSelectedSupplies(direction: "up" | "down") {
    const selectedIndices = this.supplies.reduce((acc, supply, index) => {
      if (supply.selected) acc.push(index);
      return acc;
    }, [] as number[]);

    if (direction === "up") {
      for (let i = 0; i < selectedIndices.length; i++) {
        if (
          selectedIndices[i] > 0 &&
          !this.supplies[selectedIndices[i] - 1].selected
        ) {
          [
            this.supplies[selectedIndices[i]],
            this.supplies[selectedIndices[i] - 1],
          ] = [
              this.supplies[selectedIndices[i] - 1],
              this.supplies[selectedIndices[i]],
            ];
        }
      }
    } else {
      for (let i = selectedIndices.length - 1; i >= 0; i--) {
        if (
          selectedIndices[i] < this.supplies.length - 1 &&
          !this.supplies[selectedIndices[i] + 1].selected
        ) {
          [
            this.supplies[selectedIndices[i]],
            this.supplies[selectedIndices[i] + 1],
          ] = [
              this.supplies[selectedIndices[i] + 1],
              this.supplies[selectedIndices[i]],
            ];
        }
      }
    }

    this.render();
    logger.info(`Moved selected supplies ${direction}`);
  }

  public getElement() {
    return this.tableElement;
  }

  public getSupplies() {
    return this.supplies;
  }
}
