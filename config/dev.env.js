'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_DEBUG_MODE: 'false',
  VUE_APP_TOK_BOX_API_KEY: '46171452',
  VUE_APP_SHAPE_SHIFT_URL: '"https://cors.shapeshift.io"',
  VUE_APP_ETH_GATEWAY_URL: '"http://localhost:8191"',
  VUE_APP_BTC_GATEWAY_URL: '"https://api.brightblock.org"',
  VUE_APP_SEARCH_INDEX_URL: '"http://localhost:8193"',
  VUE_APP_ETHEREUM_NETWORK: '"Ganache"',
})
