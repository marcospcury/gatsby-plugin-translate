const { getSelectorFromInternalType, validateAndCompileOptions } = require('./validation')

const {
  createBasicTranslation,
  createCompleteSpec,
  createSimpleSpec,
} = require('../__test__/mocks')

jest.mock('./utils', () => {
  const log = () => jest.fn()
  return { log }
})

describe('validation functions', () => {
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

  describe('validateAndCompileOptions', () => {
    it('Breaks with undefined options', () => {
      const { valid, _ } = validateAndCompileOptions(undefined)
      expect(valid).toBeFalsy()
    })

    it('Breaks with null options', () => {
      const { valid, _ } = validateAndCompileOptions(undefined)
      expect(valid).toBeFalsy()
    })

    it('Breaks without source language', () => {
      const { valid, _ } = validateAndCompileOptions({})
      expect(valid).toBeFalsy()
    })

    it('Breaks without target language', () => {
      const { valid, _ } = validateAndCompileOptions({ sourceLanguage: 'en' })
      expect(valid).toBeFalsy()
    })

    it('Breaks without google api key when a translation spec is set', () => {
      const { valid, _ } = validateAndCompileOptions({
        sourceLanguage: 'en',
        targetLanguages: ['en'],
        translations: [{}],
      })
      expect(valid).toBeFalsy()
    })

    it('Compiles translation spec into a dictionary', () => {
      const spec = createCompleteSpec(createBasicTranslation())

      const { valid, compiled } = validateAndCompileOptions(spec)

      expect(valid).toBeTruthy()
      expect(compiled['nodeselector']).toBeDefined()
    })

    it('Compiled spec includes source language', () => {
      const spec = createCompleteSpec(createBasicTranslation())

      const { valid, compiled } = validateAndCompileOptions(spec)

      expect(valid).toBeTruthy()
      expect(compiled['nodeselector'].sourceLanguage).toEqual('en')
    })

    it('Compiled spec includes target languages', () => {
      const spec = createCompleteSpec(createBasicTranslation())

      const { valid, compiled } = validateAndCompileOptions(spec)

      expect(valid).toBeTruthy()
      expect(compiled['nodeselector'].targetLanguages[0]).toEqual('es')
    })

    it('Compiled spec includes api key', () => {
      const spec = createCompleteSpec(createBasicTranslation())

      const { valid, compiled } = validateAndCompileOptions(spec)

      expect(valid).toBeTruthy()
      expect(compiled['nodeselector'].googleApiKey).toEqual('lorem')
    })

    it('Simple spec includes source language', () => {
      const spec = createSimpleSpec()

      const { valid, compiled } = validateAndCompileOptions(spec)

      expect(valid).toBeTruthy()
      expect(compiled.sourceLanguage).toEqual('en')
    })

    it('Simple spec includes target languages', () => {
      const spec = createSimpleSpec()

      const { valid, compiled } = validateAndCompileOptions(spec)

      expect(valid).toBeTruthy()
      expect(compiled.targetLanguages[0]).toEqual('es')
    })
  })
})
