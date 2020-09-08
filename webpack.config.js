// ディレクトリパスを取得する
const path = require('path');
const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');
//CSSを別ファイルに生成する
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // 'development' | 'production'
  mode: process.env.NODE_ENV,
  // エントリーポイントの設定
  entry: {
    main: './src/js/main.js',
  },
  // 出力の設定
  output: {
    // 出力するファイル名
    filename: 'js/[name].bundle.js',
    // 出力先のパス
    path: dist,
  },
  // ローカルサーバの指定
  devServer: {
    contentBase: src,
    watchContentBase: true,
    port: 3000,
  },
  module: {
    // babel-loaderの設定
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
        exclude: /node_modules/,
        // swiper使用時
        // exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
      },
      // SCSSをJSファイルと別々に生成する
      {
        test: /\.(sc|c|sa)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      // CSSでbackground-imageを使う
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img/common/',
              publicPath: function (path) {
                return '../img/common/' + path;
              },
            },
          },
        ],
      },
    ],
  },
  //vue.jsの設定
  // resolve: {
  //   alias: {
  //     vue$: 'vue/dist/vue.esm.js',
  //   },
  // },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '/css/[name].css',
    }),
  ],
};
