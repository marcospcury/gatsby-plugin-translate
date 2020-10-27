const { validateOptions } = require('./validation')

const {
  getSelectorFromInternalType,
  addTargetLanguage,
  addCommonOptions,
  translate,
  addNodeMetadata,
  saveTranslatedRoutes,
  deleteTranslatedRoutes,
  setStaticTranslations,
  getStaticTranslations,
  getSlugTranslator,
  getTranslation,
} = require('./node-functions')

const { clearSlugSlashes, then, all, apply, pipe } = require('./utils')

let hasValidOptions = true
let translatedRoutes = []

async function onPreInit({ cache }, options) {
  hasValidOptions = validateOptions(options)
  await setStaticTranslations(cache, options)
}

async function onCreateNode({ node, actions: { createNode } }, options) {
  if (hasValidOptions) {
    const translation = pipe(getSelectorFromInternalType, getTranslation(options))(node)

    if (translation) {
      ;(
        await all(
          options.targetLanguages
            .map(addTargetLanguage(translation))
            .map(addCommonOptions(options))
            .map(translate(node))
            .map(then(addNodeMetadata))
        )
      ).forEach(apply(createNode))
    }
  }
}

function onPostBootstrap() {
  saveTranslatedRoutes(translatedRoutes)
}

function onPostBuild() {
  deleteTranslatedRoutes()
}

async function onCreatePage({ cache, page, actions }, options) {
  const { createPage, deletePage } = actions

  const slugTranslator = getSlugTranslator(options)

  if (
    !options.targetLanguages.includes(page.path.slice(1, 3)) &&
    !page.context.language
  ) {
    for (const targetLanguage of options.targetLanguages) {
      const newSlug = await slugTranslator(targetLanguage, page.path)
      const staticTranslations = await getStaticTranslations(cache, targetLanguage)

      createPage({
        ...page,
        path: `/${targetLanguage}${newSlug}`,
        context: {
          ...page.context,
          language: targetLanguage,
          isSourceLanguage: false,
          originalPath: page.path,
          staticTranslations: staticTranslations,
        },
      })

      translatedRoutes.push({
        originalPath: clearSlugSlashes(page.path),
        language: targetLanguage,
        translatedPath: `/${targetLanguage}${newSlug}`,
      })
    }

    deletePage(page)

    const staticTranslations = await getStaticTranslations(cache, options.sourceLanguage)

    createPage({
      ...page,
      context: {
        ...page.context,
        language: options.sourceLanguage,
        isSourceLanguage: true,
        staticTranslations: staticTranslations,
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
