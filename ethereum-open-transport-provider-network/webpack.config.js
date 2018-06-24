const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, 'app'),
  entry: './index.js',
  mode: 'development',

  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
    publicPath: '/',
  },

  serve: {
    host: '0.0.0.0',
    port: '8080',
  },

  module: {
    rules: [
      // {
      //   test: /\.json$/,
      //   use: 'json-loader'
      // },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|vendor)/,
        use: ['babel-loader'],
      }
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.DefinePlugin({
    //   "process.env": { 
    //      NODE_ENV: JSON.stringify("production") 
    //    }
    // })
  ],
}
