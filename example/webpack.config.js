const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: __dirname + '/index.js',
  output:{
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:8000/dist'
  },
  module:{
    rules: [
      {
        test: /\.css$/,
        use: ['css-loader' ]
      },
      {
        test:/\.(js|jsx)$/,
        use:['babel-loader'],
        exclude:/node_modules/
      },
      {
        test:/\.(png|jpg|gif)$/,
        use:[{
            loader:'url-loader',
            options:{
                limit:50000,
                outputPath:'images'
            }
        }]
      }
    ],
  },
  resolve:{
      extensions:['.css','.js','jsx']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  mode: 'development',
  devServer: {
    contentBase: __dirname,
    historyApiFallback: true,
    hot: true,
    inline: true,
    port: 8000,
    progress: true,
    stats: {
      cached: false
    }
  }
};