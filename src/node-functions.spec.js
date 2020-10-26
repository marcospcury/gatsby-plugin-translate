const {   getSelectorFromInternalType, addTargetLanguage, getTranslation, addNodeMetadata } = require('./node-functions')

const { createBasicTranslation } = require('../__test__/mocks')

describe('Gatsby node functions', () => {
  describe('getSelectorFromInternalType', () => {
    it('Get a lowercase type name from a node to match the selector', () => {
      const node = {
        internal: {
          type: 'plugin__the_node_type',
        },
      }

      const selector = getSelectorFromInternalType(node)

      expect(selector).toEqual('pluginthenodetype')
    })
  })

  describe('addTargetLanguage', () => {
    it('Adds the target language to an existing translation spec', () => {
      const spec = createBasicTranslation()
      const fullSpec = addTargetLanguage(spec)('es')

      expect(fullSpec.targetLanguage).toEqual('es')
    })

    it('Keeps existing properties of original spec', () => {
      const spec = createBasicTranslation()
      const fullSpec = addTargetLanguage(spec)('es')

      expect(fullSpec.selector).toEqual('nodeSelector')
    })
  })

  describe('addNodeMetadata', () => {
    let originalNode = {
      id: '123',
      name: 'original node name',
      language: 'es',
      internal: {
        type: 'originalNode',
      },
    }
    it('Creates a new type with the original node type and the current language', () => {
      const newNode = addNodeMetadata(originalNode)

      expect(newNode.internal.type).toEqual('originalNode_es')
    })

    it('Creates a new id', () => {
      const newNode = addNodeMetadata(originalNode)

      expect(newNode.id).not.toEqual('123')
    })

    it('Keeps existing properties of original node', () => {
      const newNode = addNodeMetadata(originalNode)

      expect(newNode.name).toEqual('original node name')
    })
  })

  describe('getTranslation', () => {
    it('Get null from invalid translation', () => {
      const translation = getTranslation(undefined)('selector')

      expect(translation).not.toBeDefined()
    })

    it('Get translation from list', () => {
      const options = {
        translations: [
          { selector: 'Sel1', value: 'sel1' },
          { selector: 'Sel2', value: 'sel2' },
        ],
      }
      const translation = getTranslation(options)('sel1')

      expect(translation.value).toEqual('sel1')
    })

    it('Get undefined if list does not contains translation', () => {
      const options = {
        translations: [
          { selector: 'sel1', value: 'sel1' },
          { selector: 'sel2', value: 'sel2' },
        ],
      }
      const translation = getTranslation(options)('sel3')

      expect(translation).not.toBeDefined()
    })
  })
})
