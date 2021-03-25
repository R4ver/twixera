const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const package = require("./package.json");

function modify(buffer) {
    // copy-webpack-plugin passes a buffer
    var manifest = JSON.parse(buffer.toString());

    // make any modifications you like, such as
    manifest.version = package.version;
    manifest.description = package.description;

    // pretty print to JSON with two spaces
    manifest_JSON = JSON.stringify(manifest, null, 2);
    return manifest_JSON;
}

module.exports = merge(common, {
    mode: "production",
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                        warnings: false,
                        comparisons: false,
                    },
                    output: {
                        comments: /^\**!|@preserve|@license|@cc_on/i,
                    },
                },
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        context: "extension",
                        from: "manifest.json",
                        to: "./",
                        transform(content, path) {
                            return modify(content);
                        },
                    },
                    {
                        context: "extension",
                        from: "**",
                        to: "./",
                    },
                ],
            }),
        ],
    },
});