module.exports = { 
  entry: {
    jsBridge: './src',
  },
  devtool: 'none',
  resolve: {
    extensions: ['.ts', '.vue', '.json', '.js',]
  },
  output: {
    filename: `[name].js`,
    library: 'hbqJsBridge',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
    ]
  }
}