const { rm, copyFile, readdir, mkdir, access, constants } = require('fs');
const path = require('path');
const { stdout } = process;

const dirPath = path.join(__dirname, '/files');
const newDirPath = path.join(__dirname, '/files-copy');

(function copyDir() {
  stdout.write(`Copying folder ${dirPath} to ${newDirPath} ...\n`);

  // Create new folder
  access(newDirPath, constants.F_OK, (err) => {
    if (err) mkdir(newDirPath, { recursive: true }, (err) => {
      if (err) throw err;
      stdout.write(`Created folder ${newDirPath}\n`);
    });
  });

  // Delete old files
  readdir(newDirPath, (err, files) => {
    if (!err) files.forEach((file) => {
      access(path.join(dirPath, file), constants.F_OK, (err) => {
        if (err) {
          rm(path.join(newDirPath, file), (err) => {
            if (err) throw err;
            stdout.write(`Removed file ${file}\n`);
          });
        }
      });
    });
  });

  // Read and copy files
  readdir(dirPath, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      copyFile(path.join(dirPath, file), path.join(newDirPath, file), (err) => {
        if (err) {
          if (err.code === 'EPERM') {
            stdout.write(`Can't copy ${file}. Maybe it's a folder?\n`);
          } else throw err;
        } else stdout.write(`Copied file ${file}\n`);
      });
    });
  });

})();