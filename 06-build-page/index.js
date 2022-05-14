const fs = require('fs');
const fsPromises = require('fs/promises');
const { constants } = fs;
const path = require('path');
const { stdout } = process;

const distPath = path.join(__dirname, '/project-dist');
const componentsPath = path.join(__dirname, '/components');
const stylesPath = path.join(__dirname, '/styles');
const bundleCssPath = path.join(distPath, 'style.css');

// Create new project-dist folder if not exists
fsPromises.mkdir(distPath)
  .catch((err) => {
    if (err.code !== 'EEXIST') throw err;
  })
  .finally(() => {

    // Build index.html
    try {
      let template = '';
      fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8')
        .then((result) => {
          template = result;

          // Find tags
          const tags = template.match(/{{\w*}}/g);

          // Read components
          let components = tags.map((tag) => {
            const tagName = tag.slice(2, -2);
            const component = path.join(componentsPath, `${tagName}.html`);
            return fsPromises.readFile(component, 'utf-8');
          });

          // Replace template tags with components
          Promise.all(components)
            .then(components => components.forEach(
              (tag) => template = template.replace(/{{\w*}}/, tag)))

            // Write template to index.html
            .then(() => fs.writeFile(path.join(distPath, 'index.html'), template, (err) => {
              if (err) throw err;
              stdout.write(`Completed HTML at ${path.join(distPath, 'index.html')}\n`);
            }));
        });
    } catch (err) {
      console.log(err);
    }

    // Build styles.css using 05-merge-styles script
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
            }
          });
          stdout.write(`Completed CSS bundle at ${bundleCssPath}\n`);
        });
    }
    catch (err) {
      console.log(err);
    }

    // Copy assets using modified 04-copy-directory script
    copyDir(path.join(__dirname, '/assets'), path.join(distPath, '/assets'));

  });


function copyDir(dirPath, distPath) {
  // stdout.write(`Copying folder ${dirPath} to ${distPath} ...\n`);

  // Create new folder
  fs.access(distPath, constants.F_OK, (err) => {
    if (err) fs.mkdir(distPath, { recursive: true }, (err) => {
      if (err) throw err;
      stdout.write(`Created folder ${distPath}\n`);
    });
  });

  // Delete old files
  fs.readdir(distPath, (err, files) => {
    if (!err) files.forEach((file) => {
      fs.access(path.join(dirPath, file), constants.F_OK, (err) => {
        if (err) {
          fs.rm(path.join(distPath, file), (err) => {
            if (err) throw err;
            stdout.write(`Removed file ${file}\n`);
          });
        }
      });
    });
  });

  // Read and copy files
  fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      if (file.isFile()) {
        fs.copyFile(path.join(dirPath, file.name), path.join(distPath, file.name), (err) => {
          if (err) {
            throw err;
          } else stdout.write(`Copied asset ${file.name}\n`);
        });
      }
      if (file.isDirectory()) { 
        copyDir(path.join(dirPath, file.name), path.join(distPath, file.name));
      }
    });
  });
}