# Functional Programming Project

## Assignment

The assignment is available in [this PDF](./assignment.pdf).

## Authors

- Felipe Alvarenga Carvalho --- 10310526
- Lucas Viana Vilela        --- 10748409
- Roberto Severo Utagawa    --- 12690712

## Setup

### Dependencies

This projects dependencies consist of `ts-node` in order to run the script and `csv-parser` in order to... well, to *parse* the `.csv` files.

To install them, just run:
```bash
npm install
```

### Dataset

In order to run the script, you have to place `.csv` files from [this repository](https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_daily_reports) at the root of the project (in the same level as this `README.md` file and the `src/` directory).

Your file structure should look something like:

```
.
├── 01-22-2020.csv
├── 02-17-2022.csv
├── assignment.pdf
├── node_modules/
├── package.json
├── package-lock.json
├── README.md
├── src/
└── tsconfig.json
```

## Running the script

You should pass the name of the `.csv` file you want analyzed as the single CLI argument.

```bash
npm start 01-22-2020.csv
```
or
```bash
npx ts-node src/index.ts 01-22-2020.csv
```
or (if you have `ts-node` installed globally)
```bash
ts-node src/index.ts 02-17-2022.csv
```
