const { log } = require('./utils')

function getSelectorFromInternalType(node) {
  return node.internal.type.replace('__', '').split('_').join('').toLowerCase()
}

function validateAndCompileOptions(options) {
  let valid = false
  let compiled = {}

  const breakValidation = message => {
    log(message, 'error')
    return { valid, compiled }
  }

  if (!options) return breakValidation('Invalid options provided')

  const {
    googleApiKey,
    translations,
    sourceLanguage,
    targetLanguages,
    translateSlug,
  } = options

  if (!isValidString(sourceLanguage))
    return breakValidation('No source language provided')

  if (!isValidArray(targetLanguages))
    return breakValidation('You should provide at least one target language')

  if (isValidArray(translations) && !isValidString(googleApiKey))
    return breakValidation(
      'You must provide a Google api key when automatic translations are set'
    )

  compiled.sourceLanguage = sourceLanguage
  compiled.targetLanguages = targetLanguages

  if (translateSlug) {
    compiled.translateSlug = translateSlug
    compiled.googleApiKey = googleApiKey
  }

  if (isValidArray(translations)) {
    translations.forEach(translation => {
      const { ['selector']: selector, ...rest } = translation
      compiled[selector.toLowerCase()] = rest
      compiled[selector.toLowerCase()]['googleApiKey'] = googleApiKey
      compiled[selector.toLowerCase()]['sourceLanguage'] = sourceLanguage
      compiled[selector.toLowerCase()]['targetLanguages'] = targetLanguages
    })
  }

  compiled.staticTranslations = {}
  compiled.targetLanguages.forEach(language => {
    compiled.staticTranslations[language] = loadStaticTranslations(language)
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

function loadStaticTranslations(language) {
  let translations

  try {
    translations = require(`${process.cwd()}/src/translations/${language}.json`)

    if (!translations) {
      translations = require(`${process.cwd()}/src/translations/${language}.js`)
    }
  } catch {}

  return translations ? translations : {}
}

module.exports = {
  getSelectorFromInternalType,
  validateAndCompileOptions,
}
