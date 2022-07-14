/** Statistics regarding for a single country. */
export interface CovidData {
  [index: string]: string | number;
  country: string;
  confirmed: number;
  active: number;
  deaths: number;
  latitude: number;
}

/** Accumulated statistics regarding group a list of locations. */
export interface CovidDataMultipleLocations {
  [index: string]: number | number[];
  confirmed: number;
  active: number;
  deaths: number;
  latitude: number[];
}

export interface PerCountryHemispheres<T> {
  northern: T;
  southern: T;
}
