#!/usr/bin/ts-node

// import readline from 'readline'

import { URLs } from './utils';

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// })

// ask user for the anme input
// rl.question(
//   'Qual arquivo .csv do dataset passado você quer ler? ',
//   (filename: string) => {
//     rl.close()

//     if (!filename?.match(/[a-zA-Z0-9]+\.csv/)) {
//       throw new Error(
//         'O arquivo especificado é inválido. Acesse: https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_daily_reports'
//       )
//     }

//     fetch(
//       `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${filename}`
//     ).then(r => {
//       r.text().then(console.log)
//     })
//   }
// )

const filename = '02-17-2022.csv';
fetch(`${URLs.rawUrl}/${filename}`).then(async r => {
  const rawData = await r.text();
});
