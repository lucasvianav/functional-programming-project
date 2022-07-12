import { CovidData, CovidReportRow } from './model';

/** "Databse" GitHub URLs. */
export const URLs = {
  datasetUrl: 'https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_daily_reports',
  rawUrl:
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports',
};

/** Parse a CSV file's data into a list of TypeScript objects. */
export const parseCsvData = (raw: string): CovidData[] => {
  const list = raw.trim().split('\n').slice(1);
  const data: CovidData[] = list.map(row => {
    const fields = row.split(',');
    const rowData: CovidReportRow = {
      FIPS: parseInt(fields[0]),
      Admin2: fields[1],
      Province_State: fields[2],
      Country_Region: fields[3],
      Last_Update: new Date(fields[4]),
      Lat: parseFloat(fields[5]),
      Long_: parseFloat(fields[6]),
      Confirmed: parseInt(fields[8]),
      Deaths: parseInt(fields[8]),
      Recovered: parseInt(fields[10]),
      Active: parseInt(fields[11]),
      Combined_Key: fields[12],
      Incident_Rate: parseFloat(fields[13]),
      Case_Fatality_Rati: parseFloat(fields[14]),
    };

    return {
      country: rowData.Country_Region,
      active: rowData.Active,
      deaths: rowData.Deaths,
      confirmed: rowData.Confirmed,
    };
  });

  return data.filter(element => Object.values(element).every(v => typeof v === 'string' || !isNaN(v)));
};

export const NORTHERN_HEMISPHERE: Set<string> = new Set([]);
export const SOUTHERN_HEMISPHERE: Set<string> = new Set([]);
