const { getTranslator } = require('./translate-api')

let translate

async function translateObjectStructure(
  nodeStructure,
  origin,
  target,
  node,
  translationStructure = {}
) {
  for (const property in nodeStructure) {
    if (isStringNode(node, property)) {
      if (nodeStructure[property]) {
        translationStructure[property] = await translate(node[property])
      } else {
        translationStructure[property] = node[property]
      }
    } else {
      if (isArrayNode(node, property)) {
        if (nodeStructure[property]) {
          const translationAsyncResults = node[property].map(async nodeItem => {
            if (typeof nodeItem === 'string') {
              return await translate(nodeItem)
            } else {
              return await translateObjectStructure(
                nodeStructure[property],
                origin,
                target,
                nodeItem
              )
            }
          })

          translationStructure[property] = await Promise.all(
            translationAsyncResults
          )
        } else {
          translationStructure[property] = node[property]
        }
      } else {
        if (node[property] === null || node[property] === undefined) {
          translationStructure[property] = node[property]
        } else {
          translationStructure[property] = {}
          await translateObjectStructure(
            nodeStructure[property],
            origin,
            target,
            node[property],
            translationStructure[property]
          )
        }
      }
    }
  }

  return translationStructure
}

async function translateNode(nodeTranslationSpec, node) {
  if (node === null || node === undefined) return node

  const {
    nodeStructure,
    originLanguage,
    targetLanguage,
    apiKey,
  } = nodeTranslationSpec

  translate = getTranslator(originLanguage, targetLanguage, apiKey)

  const translatedValues = await translateObjectStructure(
    nodeStructure,
    originLanguage,
    targetLanguage,
    node
  )

  return translatedValues
}

function isStringNode(node, property) {
  return node && node[property] && typeof node[property] === 'string'
}

function isArrayNode(node, property) {
  return node && node[property] && Array.isArray(node[property])
}

module.exports = {
  translateNode,
}
