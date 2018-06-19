// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '0.0.0.0',
      port: 7545,
      network_id: '*' // Match any network id
    }
  }
}
