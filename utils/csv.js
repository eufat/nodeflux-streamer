const fs = require("fs");
const csvWriter = require("csv-write-stream");

function writeCSV(data) {
    const writer = csvWriter();
    writer.pipe(fs.createWriteStream("log.csv", { flags: "a" }));
    writer.write(data);
    writer.end();
}

module.exports = writeCSV;
