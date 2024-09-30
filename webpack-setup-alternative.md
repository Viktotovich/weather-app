/_ eslint-disable _/
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
mode: "development",
entry: ".src/index.js",
plugins: [
new HtmlWebpackPlugin({
template: "./src/index.html",
}),
],
devServer: {
watchFiles: ["./src/index.html"],
},
output: {
filename: "main.js",
path: path.resolve(\_\_dirname, "dist"),
clean: true,
},
devtool: "eval-source-map",
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
],
},
};
