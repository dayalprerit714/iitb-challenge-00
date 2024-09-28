/**
 * A wrapper type to model chemical supply
 * */
export interface ChemicalSupply {
  id: number;
  chemicalName: string;
  vendor: string;
  density: number;
  viscosity: number;
  packaging: string;
  packSize: number;
  unit: string;
  quantity: number;

  /**
   * Shows if the current chemical supply is selected on UI or not
   * */
  selected?: boolean;
}
