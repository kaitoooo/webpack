// ディレクトリパスを取得する
const path = require('path');
const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');
// CSSを別ファイルに生成する
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// ビルドする際にHTMLも生成する
const HtmlWebpackPlugin = require('html-webpack-plugin');
// キャッシュパラメータを付与する
const cacheParam = new Date().getTime().toString();
// 画像をコピーする
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // 'development' | 'production'
  mode: process.env.NODE_ENV,
  // エントリーポイントの設定
  context: src,
  entry: {
    main: './js/main.js',
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
    open: true,
    contentBase: src,
    watchContentBase: true,
    port: 3000,
  },
  // モジュールの解決方法を指定
  resolve: {
    modules: [src, 'node_modules'],
    extensions: ['.js'],
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
                  presets: [
                      [
                          '@babel/preset-env',
                          {
                              useBuiltIns: 'usage',
                              corejs: 3,
                          },
                      ],
                  ],
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
        test: /\.(gif|png|jpg|eot|wof|woff|woff2|ttf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '/img/',
              publicPath: function (path) {
                return '../img/' + path;
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
      filename: 'css/[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(src, 'img'),
          to: path.resolve(dist, 'img'),
          toType: 'dir',
          globOptions: {
            ignore: ['*.DS_Store', '**/.gitkeep'],
          },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      cacheParam: '?ver=' + cacheParam, // キャッシュパラメータ付与
      publicPath: 'dist', // ビルド後のHTMLの出力先
      filename: 'index.html', // 出力するHTMLのファイル名
      template: 'index.html', // 出力するためのHTMLのテンプレート
      minify: {
        removeComments: true, // コメント削除、圧縮
      },
    }),
  ],
};
