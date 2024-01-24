const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.emitWarning.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: isProduction ? '/grocery_app/': '/', 
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader', 
          'css-loader',    
          'sass-loader',   
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', 
      favicon: './public/favicon.ico',
      meta: {
        'theme-color': '#000000', 
        'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'default',
        'apple-mobile-web-app-title': 'Grocery List App',
        'msapplication-TileColor': '#000000',
      },
      icon192: './public/logo192.png', 
      icon512: './public/logo512.png', 
    }),
  ],
};
