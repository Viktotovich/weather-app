/* eslint-disable */
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const loader = require("mini-css-extract-plugin/types/loader.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  //devtool: "eval-source-map", above is for Terser
  stats: {
    loggingDebug: ["babel-loader"],
  },
  // above is for Babel
  devServer: {
    watchFiles: ["./src/index.html"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: [">0.50%", "not ie 11", "not op_mini all"],
                  },
                },
              ],
            ],
          },
        },
      },
    ],
  },
});
