const path = require('path')
var webpack = require('webpack');
const { mainModule } = require('process')

module.exports = {
    mode:'development',
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
    plugins: [
        // fix "process is not defined" error:
        // (do "npm install process" before running the build)
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
      ]
}