const path = require('path');

/* eslint-disable node/no-unpublished-require */
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  const config = {
    entry: {
      bundle: './src/index.tsx',
    },
    output: {
      filename: isProd ? '[name].[hash].js' : '[name].js',
      path: path.resolve('dist'),
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        minify: isProd,
        base: '/',
        template: './src/index.html',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
            },
          },
        },
      ],
    },
    optimization: {
      minimize: isProd,
    },
    devtool: isProd ? false : 'inline-source-map',
    devServer: {
      before: () => {
        require(path.resolve(__dirname, 'src', 'server'));
      },
    },
  };

  return config;
};
