/* eslint-disable no-sync */
const fs = require('fs');
const readline = require('readline');

const inputFileName = './words/words.json';
const outputFileName = './words/groupedWords.json';

const lineReader = readline.createInterface({
  input: fs.createReadStream(inputFileName)
});

const itemsInGroup = 600;
const pagesInGroup = 30;

let index = 0;
lineReader.on('line', line => {
  const word = JSON.parse(line);

  word.group = Math.trunc(index / itemsInGroup);
  word.page = index % pagesInGroup;

  fs.appendFileSync(outputFileName, `${JSON.stringify(word)}\n`);

  index += 1;
});
