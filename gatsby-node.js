const {
  getSelectorFromInternalType,
  validateAndCompileOptions,
} = require('./src/validation')
const { translateNode } = require('./src/translation')
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')

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
      const { createNode } = actions
      const translatedValues = await translateNode(translationSpecs, node)

      translatedValues.id = uuidv4()
      translatedValues.children = []
      translatedValues.internal = {
        type: `${node.internal.type}_${translationSpecs.targetLanguage}`,
        contentDigest: crypto
          .createHash(`md5`)
          .update(JSON.stringify(translatedValues))
          .digest(`hex`),
      }

      delete translatedValues.parent

      createNode(translatedValues)
    }
  }
}

module.exports = { onCreateNode, onPreInit }
