var file_system = require('fs');
var archiver = require('archiver');
var packageJSON = require("./package.json");

var version = packageJSON.version.replace(/\./g, "_");

const reviewListFiles = [
    ".babelrc",
    "FORTHEREVIEWER.md",
    "package.json",
    "webpack.common.js",
    "webpack.dev.js",
    "webpack.prod.js"
];

const reviewListFolders = [
    {
        folder: "./src",
        name: "src"
    },
    {
        folder: "./extension",
        name: "extension"
    },
    {
        folder: "./build",
        name: "production-build"
    }
]

/**
 * Firefox review zip
 */

var reviewOutput = file_system.createWriteStream(`../FireFoxReview/firefoxreview_${version}.zip`);
var firefoxReviewArchive = archiver('zip');

reviewOutput.on("close", function () {
    console.log(firefoxReviewArchive.pointer() + " total bytes");
    console.log(
        "reviewOutput: archiver has been finalized and the output file descriptor has closed."
    );
});

reviewOutput.on("error", function (err) {
    throw err;
});

firefoxReviewArchive.pipe(reviewOutput);

reviewListFiles.forEach( item => {
    firefoxReviewArchive.file(`./${item}`, {name: item})
})

reviewListFolders.forEach( item => {
    firefoxReviewArchive.directory(item.folder, item.name)
})

firefoxReviewArchive.finalize();

/**
 * Generate the default release zip
 */
var output = file_system.createWriteStream(`../Releases/twixera_${version}.zip`);
var releaseArchive = archiver('zip');

output.on('close', function () {
    console.log(releaseArchive.pointer() + ' total bytes');
    console.log('release: archiver has been finalized and the output file descriptor has closed.');
});

releaseArchive.on('error', function(err){
    throw err;
});

releaseArchive.pipe(output);

// append files from a sub-directory, putting its contents at the root of archive
releaseArchive.directory("./build", false);

releaseArchive.finalize();