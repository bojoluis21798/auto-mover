import watch from "watch";
import fs from "fs";
import minimist from "minimist";

/* CLI Arguements parsing */
const args = minimist(process.argv.slice(2));

const sourcePath = args.source || __dirname;
const destinationPath = args.dest || __dirname;
const extensionType = args.extension || ".torrent";

watch.createMonitor(sourcePath, (monitor) => {
  console.log(`Watching files in ${sourcePath}`);

  /* Event Listener for created files in source directory */
  monitor.on("created", (f, stat) => {
    if (stat.isFile()) {
      const filePath = f.toString();
      const filename = filePath.split("/").slice(-1)[0];
      const extension = filename.split(".").slice(-1)[0];

      if (extension === extensionType) {
        fs.rename(filePath, `${destinationPath}/${filename}`, (error) => {
          if (error) throw error;

          console.log(`${filename} moved to ${destinationPath}`);
        });
      }
    }
  });
});
