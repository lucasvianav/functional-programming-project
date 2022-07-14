export interface CovidReportRow {
  FIPS?: number;
  Admin2?: string;
  Province_State?: string;
  Country_Region: string;
  Last_Update: Date;
  Lat: number;
  Long_: number;
  Confirmed: number;
  Deaths: number;
  Recovered: number;
  Active: number;
  Combined_Key: string;
  Incident_Rate: number;
  Case_Fatality_Rati: number;
}

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
