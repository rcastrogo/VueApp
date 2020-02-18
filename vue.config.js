
process.env.VUE_APP_VERSION = 'V1.0';

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '' : ''
}