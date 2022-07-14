#!/usr/bin/ts-node

import { parse } from 'csv-parse';
import fs from 'fs';
import { ErrorMessage } from './errors';
import {
  countryMostDeathsByHemisphere,
  sumActiveForManyCases,
  sumFewestDeathsInMostActives,
  threeCountriesMostConfirmed,
} from './functionalities';
import { CovidData } from './model';
import { formatCsvData } from './utils';

// validate input filename
if (process.argv.length !== 3) {
  throw ErrorMessage.WrongCliArgs;
}
const filename = process.argv[2];
if (!fs.existsSync(`./${filename}`)) {
  throw ErrorMessage.FileNotFound;
}

// object to parse the data from the .csv file and execute a callback
const parser = parse((err, parsed: string[][]) => {
  if (err) {
    throw err;
  } else {
    const data: CovidData[] = formatCsvData(parsed);
    const { northern, southern } = countryMostDeathsByHemisphere(data);
    const functionalities = [
      threeCountriesMostConfirmed(data).join(', '),
      sumFewestDeathsInMostActives(data),
      southern,
      northern,
      sumActiveForManyCases(data),
    ];

    functionalities.forEach((output, index) => {
      console.log(`${index + 1}) ${output || ErrorMessage.NotEnoughData}`);
    });
  }
});

// read the specified file and apply the requested operations
fs.createReadStream(`./${filename}`).pipe(parser);
