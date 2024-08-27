module.exports = {
  devServer: {
    proxy: {
      '/sever/routes/api': {
        target: 'http://localhost:5000/'
      },
    }
  }
}