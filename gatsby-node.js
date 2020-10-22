const {
  getSelectorFromInternalType,
  validateAndCompileOptions,
} = require('./src/validation')

const { translateNode, translateSlug } = require('./src/translation')
const { clearSlugSlashes } = require('./src/utils')

const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')

const fs = require('fs')

let hasValidOptions = true
let compiledOptions = {}
let translatedPaths = []

function onPreInit(_, options) {
  const { valid, compiled } = validateAndCompileOptions(options)
  hasValidOptions = valid
  compiledOptions = compiled
}

async function onCreateNode({ node, actions }) {
  if (hasValidOptions) {
    const currentNode = getSelectorFromInternalType(node)
    const translationSpecs = compiledOptions[currentNode]

    if (translationSpecs) {
      for (const targetLanguage of translationSpecs.targetLanguages) {
        const { createNode } = actions
        const translatedValues = await translateNode(
          translationSpecs,
          targetLanguage,
          node
        )

        translatedValues.id = uuidv4()
        translatedValues.children = []
        translatedValues.parent = null
        translatedValues.internal = {
          type: `${node.internal.type}_${targetLanguage}`,
          contentDigest: crypto
            .createHash(`md5`)
            .update(JSON.stringify(translatedValues))
            .digest(`hex`),
        }

        createNode(translatedValues)
      }
    }
  }
}

function onPostBootstrap() {
  fs.writeFileSync(`${__dirname}/translatedRoutes.json`, JSON.stringify(translatedPaths))
}

function onPostBuild() {
  fs.unlinkSync(`${__dirname}/translatedRoutes.json`)
}

async function onCreatePage({ cache, page, actions }) {
  const { createPage, deletePage } = actions

  const slugTranslator = compiledOptions.translateSlug
    ? translateSlug.bind(
        translateSlug,
        compiledOptions.googleApiKey,
        compiledOptions.sourceLanguage
      )
    : term => term

  if (
    !compiledOptions.targetLanguages.includes(page.path.slice(1, 3)) &&
    !page.context.language
  ) {
    for (const targetLanguage of compiledOptions.targetLanguages) {
      const newSlug = await slugTranslator(targetLanguage, page.path)

      createPage({
        ...page,
        path: `/${targetLanguage}${newSlug}`,
        context: {
          ...page.context,
          language: targetLanguage,
          isSourceLanguage: false,
          originalPath: page.path,
          staticTranslations: compiledOptions.staticTranslations[targetLanguage],
          cache: cache,
        },
      })

      translatedPaths.push({
        originalPath: clearSlugSlashes(page.path),
        language: targetLanguage,
        translatedPath: `/${targetLanguage}${newSlug}`,
      })
    }

    deletePage(page)

    createPage({
      ...page,
      context: {
        ...page.context,
        language: compiledOptions.sourceLanguage,
        isSourceLanguage: true,
        staticTranslations:
          compiledOptions.staticTranslations[compiledOptions.sourceLanguage],
        currentPath: page.path,
      },
    })
  }
}

module.exports = {
  onCreateNode,
  onPreInit,
  onCreatePage,
  onPostBootstrap,
  onPostBuild,
}
