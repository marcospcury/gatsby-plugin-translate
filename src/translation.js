const { getTranslator } = require('./translate-api')
const { clearSlugSlashes } = require('./utils')

let translate

async function translateObjectStructure(structure, node, translation = {}) {
  for (const prop in node) {
    if (isObjectNode(structure, prop)) {
      if (isArrayNode(node, prop)) {
        const asyncMap = node[prop].map(
          async nodeItem => await translateObjectStructure(structure[prop], nodeItem)
        )
        translation[prop] = await Promise.all(asyncMap)
      } else {
        translation[prop] = {}
        await translateObjectStructure(structure[prop], node[prop], translation[prop])
      }
    } else {
      if (isArrayNode(node, prop)) {
        if (structure[prop]) {
          const asyncMap = node[prop].map(async nodeItem => await translate(nodeItem))
          translation[prop] = await Promise.all(asyncMap)
        } else {
          translation[prop] = node[prop]
        }
      } else {
        translation[prop] = structure[prop] ? await translate(node[prop]) : node[prop]
      }
    }
  }

  return translation
}

async function translateNode(translation, node) {
  if (node === null || node === undefined) return node

  const { nodeStructure, originLanguage, targetLanguage, googleApiKey, cacheResolver } = translation

  translate = getTranslator(cacheResolver, originLanguage, targetLanguage, googleApiKey)

  const translatedValues = await translateObjectStructure(nodeStructure, node)

  return {
    ...translatedValues,
    language: targetLanguage,
  }
}

function isArrayNode(node, property) {
  return node && node[property] && Array.isArray(node[property])
}

function isObjectNode(node, property) {
  return typeof node[property] === 'object'
}

async function translateSlug(cacheResolver, googleApiKey, sourceLanguage, targetLanguage, slug) {
  const translator = getTranslator(cacheResolver, sourceLanguage, targetLanguage, googleApiKey)
  const term = clearSlugSlashes(slug).split('-').join(' ').trim()
  const translated = await translator(term)
  return `/${translated.split(' ').join('-')}`
}

module.exports = {
  translateNode,
  translateSlug,
}
