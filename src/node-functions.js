const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const path = require('path')

const { translateNode, translateSlug } = require('./translation')

const { all } = require('./utils')

function getSelectorFromInternalType(node) {
  return node.internal.type.replace('__', '').split('_').join('').toLowerCase()
}

const addTargetLanguage = translationSpec => targetLanguage => ({
  ...translationSpec,
  targetLanguage,
})

const addCommonOptions = ({
  googleApiKey,
  sourceLanguage,
  cacheResolver,
}) => translationSpec => ({
  ...translationSpec,
  googleApiKey,
  sourceLanguage,
  cacheResolver,
})

const translate = node => async spec => {
  return await translateNode(spec, node)
}

const addNodeMetadata = node => {
  const { internal } = node

  return {
    ...node,
    id: uuidv4(),
    children: [],
    parent: '__SOURCE__',
    internal: {
      type: `${internal.type}_${node.language}`,
      contentDigest: crypto.createHash(`md5`).update(JSON.stringify(node)).digest(`hex`),
    },
  }
}

const saveTranslatedRoutes = translatedRoutes => {
  fs.writeFileSync(
    `${path.join(__dirname, '../')}/translatedRoutes.json`,
    JSON.stringify(translatedRoutes)
  )
}

const deleteTranslatedRoutes = () => {
  fs.unlinkSync(`${path.join(__dirname, '../')}/translatedRoutes.json`)
}

const setStaticTranslations = async (cache, { targetLanguages }) => {
  await all(
    targetLanguages
      .map(loadStaticTranslationsFromFile)
      .map(cacheStaticTranslations(cache))
  )
}

const getStaticTranslations = async (cache, language) =>
  await cache.get(`static_${language}`)

const loadStaticTranslationsFromFile = language => {
  let translations

  try {
    translations = require(`${process.cwd()}/src/translations/${language}.json`)

    if (!translations) {
      translations = require(`${process.cwd()}/src/translations/${language}.js`)
    }
  } catch {}

  return translations ? { ...translations, language } : { language }
}

const cacheStaticTranslations = cache => async translation => {
  await cache.set(`static_${translation.language}`, translation)
}

const getSlugTranslator = options => {
  return options.translateSlug
    ? translateSlug.bind(
        translateSlug,
        options.cacheResolver,
        options.googleApiKey,
        options.sourceLanguage
      )
    : (_, term) => term
}

const getTranslation = options => nodeSelector => {
  const translations = options ? options.translations : []
  const translation = translations.find(tr => tr.selector.toLowerCase() === nodeSelector)

  return translation
}

module.exports = {
  getSelectorFromInternalType,
  addTargetLanguage,
  translate,
  addNodeMetadata,
  saveTranslatedRoutes,
  deleteTranslatedRoutes,
  setStaticTranslations,
  getStaticTranslations,
  getSlugTranslator,
  getTranslation,
  addCommonOptions,
}
