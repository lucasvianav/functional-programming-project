import { CovidData } from './model';

/**
 * Parse a CSV file's data into a list of TypeScript objects.
 * @param raw parsed .csv data as a list of lists of strings, the first one being the .csv headers
 * @returns the formatted data
 */
export const formatCsvData = (raw: string[][]): CovidData[] => {
  const headers = raw[0];
  const targetHeaders: { [P in keyof CovidData]?: number } = {};
  const mapTargetHeadersToFieldName: { [P in keyof CovidData]: string } = {
    country: 'country',
    confirmed: 'confirm',
    active: 'active',
    deaths: 'death',
    latitude: 'lat',
  };

  headers.forEach((header, i) => {
    Object.entries(mapTargetHeadersToFieldName).forEach(entry => {
      const [attr, startingName] = entry;
      if (header.toLowerCase().startsWith(startingName)) {
        targetHeaders[attr as keyof CovidData] = i;
      }
    });
  });

  const data: CovidData[] = raw.slice(1).map(fields => {
    const formatted: CovidData = {} as any;

    if (targetHeaders.country !== undefined) {
      formatted.country = fields[targetHeaders.country];
    }
    if (targetHeaders.confirmed !== undefined) {
      formatted.confirmed = parseInt(fields[targetHeaders.confirmed]);
    }
    if (targetHeaders.active !== undefined) {
      formatted.active = parseInt(fields[targetHeaders.active]);
    }
    if (targetHeaders.deaths !== undefined) {
      formatted.deaths = parseInt(fields[targetHeaders.deaths]);
    }
    if (targetHeaders.latitude !== undefined) {
      formatted.deaths = parseFloat(fields[targetHeaders.latitude]);
    }

    return formatted;
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
