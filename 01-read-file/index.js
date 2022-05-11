const fs = require('fs');
const path = require('path');
const { stdout } = process;

const filePath = path.join(__dirname, 'text.txt');

stdout.write(`\nЧитаю файл ${filePath}\n\n`);
const stream = fs.createReadStream(filePath, 'utf-8');
stream.on('data', chunk => stdout.write(chunk));
stream.on('end', () => stdout.write('\n\nЧтение с файла завершено.\n'));
stream.on('error', error => console.log('Error', error.message));

