const { readdir, stat } = require ('fs');
const path = require('path');
const { stdout } = process;

const filePath = path.join(__dirname, '/secret-folder');
stdout.write(`The list of files in ${filePath}:\n`);
readdir(filePath, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    if (file.isFile()) {
      stat(path.join(filePath, file.name), (err, stats) => {
        if (err) throw err;
        const name = path.parse(file.name).name;
        let ext = path.extname(file.name).slice(1);
        if (ext === '') ext = '(no ext)';
        stdout.write(`${name} - ${ext} - ${stats.size / 1000}kb\n`);
      });
    }
  });
});
