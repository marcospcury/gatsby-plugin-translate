function log(message, type = 'info') {
  const colors = {
    info: '\x1b[34m%s\x1b[0m',
    warn: '\x1b[33m%s\x1b[0m',
    error: '\x1b[41m%s\x1b[0m',
  }
  console.log(colors[type], type, ' [gatsby-plugin-translate] ', message)
}

module.exports = { log }
