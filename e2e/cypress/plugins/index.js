const cucumber = require('cypress-cucumber-preprocessor').default

module.exports = on => {
  on('file:preprocessor', cucumber())
  require('cypress-plugin-retries/lib/plugin')(on)
}
