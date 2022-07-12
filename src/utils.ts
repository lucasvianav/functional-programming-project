import { CovidData, CovidReportRow } from './model'

/** "Databse" GitHub URLs. */
export const urls = {
  datasetUrl:
    'https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_daily_reports',
  rawUrl:
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports',
}

/** Parse a CSV file's data into a list of TypeScript objects. */
export const parseCsvData = (raw: string): CovidData[] => {
  const list = raw.trim().split('\n').slice(1)
  const data: CovidData[] = list.map(row => {
    const fields = row.split(',')
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
    }

    return {
      country: rowData.Country_Region,
      active: rowData.Active,
      deaths: rowData.Deaths,
      confirmed: rowData.Confirmed,
    }
  })

  return data.filter(element =>
    Object.values(element).every(v => typeof v === 'string' || !isNaN(v))
  )
}

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
