#!/usr/bin/ts-node

import { parse } from 'csv-parse';
import fs from 'fs';
import { CovidData } from './model';
import { formatCsvData } from './utils';

// if (process.argv.length !== 3) {
//   throw 'Você deve passar como argumento apenas o nome de um arquivo CSV. Por exemplo: `npm start 02-17-2022.csv`';
// }

// const filename = process.argv[2];
const filename = '02-17-2022.csv';

const parser = parse((err, parsed: string[][]) => {
  if (err) {
    throw err;
  } else {
    const data: CovidData[] = formatCsvData(parsed);
    console.log(data);
  }
});

fs.createReadStream(`./${filename}`).pipe(parser);
