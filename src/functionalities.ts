import { CountryHemispheres, CovidData } from './model';
import { filterInvalidAttributes, getNHighest } from './utils';

/** Find the names (sorted) of the three coutries with most confirmed cases in a dataset. */
export const threeCountriesMostConfirmed = (data: CovidData[]): string[] => {
  data = filterInvalidAttributes({ confirmed: 'string' }, data);
  return getNHighest<CovidData>(data, 3, (a, b) => a.confirmed - b.confirmed)
    .map(element => element.country)
    .sort();
};

/** Find the countries with most deaths for the each hemisphere. */
export const countryMostDeathsByHemisphere = (data: CovidData[]): CountryHemispheres => {
  data = filterInvalidAttributes({ latitude: 'number', deaths: 'number' }, data);
  let northern: CovidData = { country: '', active: 0, deaths: 0, confirmed: 0, latitude: 0 };
  let southern: CovidData = { country: '', active: 0, deaths: 0, confirmed: 0, latitude: 0 };

  data.forEach(row => {
    if (row.latitude >= 0 && row.deaths > northern.deaths) {
      northern = row;
    } else if (row.latitude < 0 && row.deaths > southern.deaths) {
      southern = row;
    }
  });

  return { northern: northern.country, southern: southern.country };
};

/** Sum "active" field of all countries with at least 1,000,000 confirmed cases. */
export const sumActiveForManyCases = (data: CovidData[]): number => {
  data = filterInvalidAttributes({ active: 'number', confirmed: 'number' }, data);
  return data.reduce((acc, cur) => acc + (cur.confirmed >= 1e6 ? cur.active : 0), 0);
}

/** Sum "death" fields for the 5 countries with the fewest active cases for the 10 with the most confirmed cases. */
export const sumFewestDeathsInMostActives = (data: CovidData[]): number => {
  data = filterInvalidAttributes({ active: 'number', confirmed: 'number', deaths: 'number' }, data);
  return getNHighest<CovidData>(
    getNHighest<CovidData>(data, 10, (a, b) => a.active - b.active),
    5,
    (a, b) => b.confirmed - a.confirmed
  ).reduce((acc, cur) => acc + cur.deaths, 0);
};
