import { CovidData, CovidReportRow } from './model';

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
      latitude: rowData.Lat,
    };
  });

  return data;
};

/**
  * Extract the `n` highest elements from a list.
  * @param list the target dataset (to extract elements from)
  * @param n number of elements elements to extract
  * @param cmpFn function to compare two elements in `list` (return <0 if a < b and >0 otherwise)
  */
export const getNHighest = <T>(list: T[], n: number, cmpFn: (a: T, b: T) => number): T[] => {
  if (list.length <= n) {
    return list;
  }

  const firstN = list.splice(0, n).sort(cmpFn);
  return list.reduce((acc, cur) => {
    if (cmpFn(cur, acc[0]) > 0) {
      acc[0] = cur;
      acc = acc.sort(cmpFn);
    }
    return acc;
  }, firstN);
};

/**
 * Filter a dataset to remove all elements with invalid attributes.
 * @param attr object in which the keys are required the attribute names and the values are the attribute's expected types
 * @param list the dataset to be filtered
 * @returns the filtered data
 */
export const filterInvalidAttributes = <T extends Object>(attr: { [k: string]: string }, list: T[]): T[] =>
  list.filter(element =>
    Object.entries(element).every(entry => {
      const [key, value] = entry;

      if (attr[key] && typeof value === attr[key]) {
        switch (attr[key]) {
          case 'number':
            return !isNaN(value);
          case 'string':
            return !!value;
          default:
            return true;
        }
      } else if (attr[key]) {
        return false;
      } else {
        return true;
      }
    })
  );
