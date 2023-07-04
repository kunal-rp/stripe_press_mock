const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "./src/index.js"),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".*", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "./public"),
    filename: "bundle.js",
  },
  devServer: {
    static: path.resolve(__dirname, "./public"),
  },
};
