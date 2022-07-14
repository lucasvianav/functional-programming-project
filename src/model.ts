export interface CovidData {
  country: string;
  confirmed: number;
  active: number;
  deaths: number;
  latitude: number;
}

export interface CountryHemispheres {
  northern: string;
  southern: string;
}
