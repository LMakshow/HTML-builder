const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const { stdout } = process;

const stylesPath = path.join(__dirname, '/styles');
const bundleCssPath = path.join(__dirname, '/project-dist', 'bundle.css');

try {
  // Create new empty bundle
  fsPromises.writeFile(bundleCssPath, '')
    .then(async () => {
      // Reading styles directory
      const files = await fsPromises.readdir(stylesPath, { withFileTypes: true });
      files.forEach((file) => {
        // For each file: if file is CSS, piping it to the bundle
        if (file.isFile() && (path.extname(file.name) === '.css')) {
          const input = fs.createReadStream(path.join(stylesPath, file.name), 'utf-8');
          const output = fs.createWriteStream(bundleCssPath, { flags: 'a' });
          input.pipe(output);
          stdout.write(`Merged file ${file.name}\n`);
        }
      });
      stdout.write(`Completed CSS bundle at ${bundleCssPath}\n`);
    });
}
catch (err) {
  console.log(err);
}
