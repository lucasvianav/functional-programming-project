import { CovidData, CovidDataMultipleLocations } from './model';

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

  /**
   * Object in which the keys are the countries (or indices) and the values
   * are the data. This is necessary instead of a plain array because we want
   * to accumulate the data for each country in a way that each one has
   * a single entry in the dataset.
   */
  const data: { [k: string | number]: CovidDataMultipleLocations } = {};
  /**
   * Object in which the keys are the countries and the values
   * are objects that have a flag for each desired attribute
   * indicating if it has at least one valid numeric value.
   */
  const countryHasNotNaN: { [k: string]: { [P in keyof CovidDataMultipleLocations]?: boolean } } = {};

  // format existing fields for each row and
  // merge multiple rows with the same country
  raw.slice(1).forEach((fields, i) => {
    /** Current dataset entry. */
    let curr: CovidDataMultipleLocations, value: number;
    /** Object used to initialize a new entry to `data`. */
    const init: CovidDataMultipleLocations = { active: 0, deaths: 0, latitude: [], confirmed: 0 };
    /** The country's name. */
    const country = targetFieldsIndex.country !== undefined ? fields[targetFieldsIndex.country] : '';

    // set `curr` to the current dataset entry
    if (country) {
      // if a country name was provided, but this is it's first appearance
      if (!data[country]) {
        data[country] = { ...init };
        countryHasNotNaN[country] = { active: false, deaths: false, confirmed: false };
      }
      curr = data[country];
    } else {
      // if no country name was provided, map to index
      data[i] = { ...init };
      curr = data[i];
    }

    // save each numeric attribute in it's own way
    // confirmed, active, deaths: sum int (accumulate)
    // latitude: save floats in list to use the average
    if (targetFieldsIndex.confirmed !== undefined) {
      value = parseInt(fields[targetFieldsIndex.confirmed]);
      if (country) {
        countryHasNotNaN[country].confirmed ||= !isNaN(value);
        value ||= 0;
      }
      curr.confirmed += value;
    }
    if (targetFieldsIndex.active !== undefined) {
      value = parseInt(fields[targetFieldsIndex.active]);
      if (country) {
        countryHasNotNaN[country].active ||= !isNaN(value);
        value ||= 0;
      }
      curr.active += value;
    }
    if (targetFieldsIndex.deaths !== undefined) {
      value = parseInt(fields[targetFieldsIndex.deaths]);
      if (country) {
        countryHasNotNaN[country].deaths ||= !isNaN(value);
        value ||= 0;
      }
      curr.deaths += value;
    }
    if (targetFieldsIndex.latitude !== undefined) {
      value = parseFloat(fields[targetFieldsIndex.latitude]);
      if (!isNaN(value)) {
        curr.latitude.push(value);
      }
    }
  });

  // validate accumulated numeric attributes, calculate average
  // latitude and include country name in the resulting object
  return Object.entries(data).map<CovidData>(entry => {
    const [countryOrIndex, element] = entry as [string | number, CovidDataMultipleLocations];
    const country: string = typeof countryOrIndex === 'number' ? '' : countryOrIndex;
    const latitude = element.latitude ? average(element.latitude) : NaN;

    if (country) {
      // validate numeric values (check for non-NaN)
      Object.entries(countryHasNotNaN[country]).forEach(entry => {
        const [key, hasNotNaN] = entry as [keyof CovidDataMultipleLocations, boolean];
        element[key] = hasNotNaN ? element[key] : NaN;
      });
    }

    return { ...element, country, latitude };
  });
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

/** Calculate the average of a list of numbers. */
export const average = (arr: number[]): number => arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
