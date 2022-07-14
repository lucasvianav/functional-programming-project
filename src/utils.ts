import { CovidData } from './model';

/**
 * Parse a CSV file's data into a list of TypeScript objects.
 * @param raw parsed .csv data as a list of lists of strings, the first one being the .csv headers
 * @returns the formatted data
 */
export const formatCsvData = (raw: string[][]): CovidData[] => {
  /** Original .csv headers. */
  const headers = raw[0];
  /**
   * Object in which the key is the desired attribute's name
   * and the value is it's index in the raw data row array.
   */
  const targetFieldsIndex: { [P in keyof CovidData]?: number } = {};
  /**
   * Object in which the keys are the desired attributes' names and the
   * values are how their raw header names are expected to start with.
   */
  const mapTargetFieldsToRawHeader: { [P in keyof CovidData]: string } = {
    country: 'country',
    confirmed: 'confirm',
    active: 'active',
    deaths: 'death',
    latitude: 'lat',
  };

  // populate `targetFieldsIndex`
  headers.forEach((header, index) => {
    Object.entries(mapTargetFieldsToRawHeader).forEach(entry => {
      const [attr, startingName] = entry;
      if (header.toLowerCase().startsWith(startingName)) {
        targetFieldsIndex[attr as keyof CovidData] = index;
      }
    });
  });

  // format existing fields for each row
  const data: CovidData[] = raw.slice(1).map(fields => {
    const formatted: CovidData = {} as any;

    if (targetFieldsIndex.country !== undefined) {
      formatted.country = fields[targetFieldsIndex.country];
    }
    if (targetFieldsIndex.confirmed !== undefined) {
      formatted.confirmed = parseInt(fields[targetFieldsIndex.confirmed]);
    }
    if (targetFieldsIndex.active !== undefined) {
      formatted.active = parseInt(fields[targetFieldsIndex.active]);
    }
    if (targetFieldsIndex.deaths !== undefined) {
      formatted.deaths = parseInt(fields[targetFieldsIndex.deaths]);
    }
    if (targetFieldsIndex.latitude !== undefined) {
      formatted.deaths = parseFloat(fields[targetFieldsIndex.latitude]);
    }

    return formatted;
  });

  return data;
};

/**
 * Extract the `n` largest elements from a list.
 * @param list the target dataset (to extract elements from)
 * @param n number of elements elements to extract
 * @param cmpFn function to compare two elements in `list` (return <0 if a < b and >0 otherwise)
 * @returns the n largest elements in `list` according to `cmpFn`
 */
export const getNLargest = <T>(list: T[], n: number, cmpFn: (a: T, b: T) => number): T[] => {
  // if list has fewer elements than
  // desired, the result is itself
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
          case 'number': // NaN is invalid
            return !isNaN(value);
          case 'string': // empty string if invalid
            return !!value;
          default:
            return true;
        }
      } else if (attr[key]) {
        // attribute exists but has unexpected type
        return false;
      } else {
        return true;
      }
    })
  );
