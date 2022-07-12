import { CountryHemispheres, CovidData } from './model';
import { getNHighest, NORTHERN_HEMISPHERE, SOUTHERN_HEMISPHERE } from './utils';

/** Find the names (sorted) of the three coutries with most confirmed cases in a dataset. */
export const threeCountriesMostConfirmed = (data: CovidData[]): string[] =>
  getNHighest<CovidData>(data, 3, (a, b) => a.confirmed - b.confirmed)
    .map(element => element.country)
    .sort();

/** Find the countries with mots death for the northern and southern hemispheres. */
export const countryMostDeathsByHemisphere = (data: CovidData[]): CountryHemispheres => {
  let northern: CovidData = { country: '', active: 0, deaths: 0, confirmed: 0 };
  let southern: CovidData = { country: '', active: 0, deaths: 0, confirmed: 0 };

  data.forEach(row => {
    if (NORTHERN_HEMISPHERE.has(row.country) && row.deaths > northern.deaths) {
      northern = row;
    } else if (SOUTHERN_HEMISPHERE.has(row.country) && row.deaths > southern.deaths) {
      southern = row;
    }
  });

  return { northern: northern.country, southern: southern.country };
};

/** Sum "active" field of all countries with at least 1,000,000 confirmed cases. */
export const sumActiveForManyCases = (data: CovidData[]): number =>
  data.reduce((acc, cur) => acc + (cur.confirmed >= 1e6 ? cur.active : 0), 0);

/** Sum "death" fields for the 5 countries with the fewest active cases for the 10 with the most confirmed cases. */
export const sumFewestDeathsInMostActives = (data: CovidData[]): number =>
  getNHighest<CovidData>(
    getNHighest<CovidData>(data, 10, (a, b) => a.active - b.active),
    5,
    (a, b) => b.confirmed - a.confirmed
  ).reduce((acc, cur) => acc + cur.deaths, 0);
