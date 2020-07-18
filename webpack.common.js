const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");

console.log(process.env.NODE_ENV);

module.exports = {
    entry: {
        twixera: "./src/index.js",
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "twixera.js",
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                /* We"ll leave npm packages as is and not 
                parse them with Babel since most of them 
                are already pre-transpiled anyway. */
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                targets: {
                                    browsers: ["last 2 versions"],
                                },
                            },
                        ],
                    ],
                },
            },
            {
                test: /\.s?css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
        new MiniCssExtractPlugin([
            {
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: "twixera.css",
                chunkFilename: "[id].css",
            },
        ]),
        new Dotenv(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        }),
    ],
    resolve: {
        alias: {
            PackageConfig: path.resolve(__dirname, "./package.json"),
            Root: path.resolve(__dirname, "./src"),
            Core: path.resolve(__dirname, "./src/core"),
            Store: path.resolve(__dirname, "./src/core/store"),
            Twixera: path.resolve(__dirname, "./src/core/utils/twixera.js"),
            Components: path.resolve(__dirname, "./src/components"),
            Modules: path.resolve(__dirname, "./src/modules"),
            Hooks: path.resolve(__dirname, "./src/hooks"),
            UI: path.resolve(__dirname, "./src/UI"),
        },
        extensions: [".js", ".jsx", ".json", ".css", ".scss"],
        modules: [path.join(__dirname, "src"), "node_modules"],
    },
};
