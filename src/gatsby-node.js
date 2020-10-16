const { getSelectorFromInternalType, validateAndCompileOptions } = require('./lib/validation')
const { translateNode } = require('./lib/translation')

let hasValidOptions = true
let compiledOptions = {}

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
      const { createNodeField } = actions
      const translatedValues = await translateNode(translationSpecs, node)

      createNodeField({
        node,
        name: translationSpecs.targetLanguage,
        value: translatedValues,
      })
    }
  }
}

module.exports = { onCreateNode, onPreInit }
