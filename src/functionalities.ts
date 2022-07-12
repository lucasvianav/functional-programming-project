import { CovidData } from './model'

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
