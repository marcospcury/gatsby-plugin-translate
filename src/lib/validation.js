const { log } = require('./utils')

function getSelectorFromInternalType(node) {
  return node.internal.type.replace('__', '').split('_').join('').toLowerCase()
}

function validateAndCompileOptions(options, l = log) {
  let valid = false
  let compiled = {}

  const breakValidation = message => {
    l(message, 'error')
    return { valid, compiled }
  }

  if (!options) return breakValidation('Invalid options provided')

  const { googleApiKey, translations } = options

  if (!isValidString(googleApiKey))
    return breakValidation('Invalid Google api key provided')

  if (!isValidArray(translations))
    return breakValidation(
      'You should provide at least one translation specification'
    )

  translations.forEach(translation => {
    const { ['selector']: selector, ...rest } = translation
    compiled[selector.toLowerCase()] = rest
    compiled[selector.toLowerCase()]['googleApiKey'] = googleApiKey
    
  })

  valid = true

  return { valid, compiled }
}

function isValidString(text) {
  return text && typeof text === 'string' && text.trim() !== ''
}

function isValidArray(arr) {
  return arr && Array.isArray(arr) && arr.length > 0
}

module.exports = {
  getSelectorFromInternalType,
  validateAndCompileOptions,
}
