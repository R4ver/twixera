const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const package = require('./package.json');

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
    mode: "development",
    devtool: "inline-source-map",
    watch: true,
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    context: "dev-server/dev-extension",
                    from: "manifest.json",
                    to: "./",
                    transform(content, path) {
                        return modify(content);
                    },
                },
                {
                    context: "dev-server/dev-extension",
                    from: "**",
                    to: "./",
                },
            ],
        }),
    ],
});
