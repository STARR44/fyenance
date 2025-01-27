const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    // filename: "[name].[contenthash].js", // Use content hashing for cache busting
    filename: "[name].js", // Use content hashing for cache busting
    clean: true, // Clean the output directory on each build
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], // Handle CSS files
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/, // Handle image files
        type: "asset/resource",
      },
    ],
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: "all", // Split common dependencies into separate chunks
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Reference your base HTML template
      filename: "index.html",
    }),
    // new webpack.DefinePlugin({
    //   "process.env": {
    //     NODE_ENV: JSON.stringify("production"),
    //   },
    // }),
  ],
  devServer: {
    static: path.resolve(__dirname, "./static/frontend"),
    hot: true,
    historyApiFallback: true, // Support for React Router
    port: 3000,
  },
};
