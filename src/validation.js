const { log } = require('./utils')

function validateOptions(options) {
  const breakValidation = message => {
    log(message, 'error')
    return false
  }

  if (!options) return breakValidation('Invalid options provided')

  const { googleApiKey, translations, sourceLanguage, targetLanguages } = options

  if (!isValidString(sourceLanguage))
    return breakValidation('No source language provided')

  if (!isValidArray(targetLanguages))
    return breakValidation('You should provide at least one target language')

  if (isValidArray(translations) && !isValidString(googleApiKey))
    return breakValidation(
      'You must provide a Google api key when automatic translations are set'
    )

  return true
}

function isValidString(text) {
  return text && typeof text === 'string' && text.trim() !== ''
}

function isValidArray(arr) {
  return arr && Array.isArray(arr) && arr.length > 0
}

module.exports = {
  validateOptions,
}
