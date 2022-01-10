const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

let buildMode = process.env.BUILD_MODE
let outputPath = path.join(__dirname, "dist/app");

module.exports = {
  mode: buildMode,
  devtool: buildMode === "development" ? "source-map" : false,

  entry: {
    main: {
      import: "./src/main/index.tsx",
    },
  },

  output: {
    clean: true,
    path: outputPath,
    filename: "[name].bundle.js",
    assetModuleFilename: "assets/[hash][ext][query]"
  },

  resolve: {
    extensions: [
      ".js",
      ".ts",
      ".tsx",
      ".css",
      ".scss"
    ],
    alias: {
      main: path.resolve(__dirname, "src/main"),
    }
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          "ts-loader"
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: "assets/images/[hash][ext]"
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: "assets/fonts/[hash][ext]"
        }
      },
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].bundle.css"
    }),

    new HtmlWebpackPlugin({
      template: "./src/main/index.html",
      filename: "main.html",
      chunks: ["main"]
    }),
  ],

  devServer: {
    host: "127.0.0.1",
    port: 8080,
    compress: true,
  }
};
