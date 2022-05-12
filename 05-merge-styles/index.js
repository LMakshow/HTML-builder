const fs = require('fs');
const path = require('path');
const { stdout } = process;

const stylesPath = path.join(__dirname, '/styles');
const bundleCssPath = path.join(__dirname, '/project-dist', 'bundle.css');

fs.writeFile(bundleCssPath, '', (err) => {
  if (err) throw err;
});

fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    if (file.isFile() && (path.extname(file.name) === '.css')) {
      const input = fs.createReadStream(path.join(stylesPath, file.name), 'utf-8');
      const output = fs.createWriteStream(bundleCssPath, { flags: 'a'});
      input.pipe(output);
      stdout.write(`Merged file ${file.name}\n`);
    }
  }
  );
  stdout.write(`Completed CSS bundle at ${bundleCssPath}\n`);
});
