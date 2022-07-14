export const enum ErrorMessage {
  FileNotFound = 'O arquivo informado não foi encontrado. Lembre que ele deve estar no momesmo diretório que a raíz deste projeto (ou seja, no mesmo nível do diretório `src`).',
  NotEnoughData = '<<Não haviam dados válidos suficientes para o cálculo.>>',
  WrongCliArgs = 'Você deve passar como argumento apenas o nome de um arquivo CSV. Por exemplo: `npm start 02-17-2022.csv`, ou `ts-node src/index.ts 02-17-2022.csv`.',
}
