import { CountryHemispheres, CovidData } from './model'
import { NORTHERN_HEMISPHERE, SOUTHERN_HEMISPHERE } from './utils'

/**
 * Find the names of the three coutries with most confirmed cases in a dataset.
 * @param data dataset to be considered
 * @returns three countries with most confirmed cases in alphabetical order
 */
export const threeCountriesMostConfirmed = (data: CovidData[]): string[] => {
  const sortFn = (a: CovidData, b: CovidData) => a.confirmed - b.confirmed
  const firstThree = data.splice(0, 3).sort(sortFn)

  return data
    .reduce((acc, cur) => {
      if (cur.confirmed > acc[0].confirmed) {
        acc[0] = cur
        acc = acc.sort(sortFn)
      }
      return acc
    }, firstThree)
    .map(element => element.country)
}

/** Find the countries with mots death for the northern and southern hemispheres. */
export const countryMostDeathsByHemisphere = (data: CovidData[]): CountryHemispheres => {
  let northern: CovidData = { country: '', active: 0, deaths: 0, confirmed: 0 }
  let southern: CovidData = { country: '', active: 0, deaths: 0, confirmed: 0 }

  data.forEach(row => {
    if (NORTHERN_HEMISPHERE.has(row.country) && row.deaths > northern.deaths) {
      northern = row
    } else if (SOUTHERN_HEMISPHERE.has(row.country) && row.deaths > southern.deaths) {
      southern = row
    }
  })

  return { northern: northern.country, southern: southern.country }
}
