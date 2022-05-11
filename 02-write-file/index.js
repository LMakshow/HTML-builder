const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { stdin, stdout } = process;

const filePath = path.join(__dirname, 'text.txt');
fs.writeFile(filePath, '', (err) => { 
  if (err) throw err;
});
process.on('SIGINT', () => {
  stdout.write(`Файл ${filePath} создан. До новых встреч!\n\n`);
  process.exit();
});

stdout.write('\nПриветствую! Какую безумную вещь будем писать в файл сегодня?\n');

const rl = readline.createInterface({
  input: stdin,
});

rl.on('line', (input) => {
  // rl.on('SIGINT', () => process.emit('SIGINT'));
  if (input === 'exit') {
    rl.close();
    process.emit('SIGINT');
  } else fs.appendFile(filePath, input + '\n', (err) => {
    if (err) throw err;
  });
});

