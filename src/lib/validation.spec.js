const {
  getSelectorFromInternalType,
  validateAndCompileOptions,
} = require('./validation')

const {
  createBasicTranslation,
  createCompleteSpec,
} = require('../../__test__/mocks')

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
    let logMock

    beforeEach(() => {
      logMock = jest.fn(() => {})
    })

    it('Breaks with undefined options', () => {
      const { valid, _ } = validateAndCompileOptions(undefined, logMock)
      expect(valid).toBeFalsy()
      expect(logMock).toBeCalledWith('Invalid options provided', 'error')
    })

    it('Breaks with null options', () => {
      const { valid, _ } = validateAndCompileOptions(undefined, logMock)
      expect(valid).toBeFalsy()
      expect(logMock).toBeCalledWith('Invalid options provided', 'error')
    })

    it('Breaks without google api key', () => {
      const { valid, _ } = validateAndCompileOptions({}, logMock)
      expect(valid).toBeFalsy()
      expect(logMock).toBeCalledWith('Invalid Google api key provided', 'error')
    })

    it('Breaks with empty google api key', () => {
      const { valid, _ } = validateAndCompileOptions(
        { googleApiKey: '' },
        logMock
      )
      expect(valid).toBeFalsy()
      expect(logMock).toBeCalledWith('Invalid Google api key provided', 'error')
    })

    it('Breaks without translation spec', () => {
      const { valid, _ } = validateAndCompileOptions(
        { googleApiKey: 'a' },
        logMock
      )
      expect(valid).toBeFalsy()
      expect(logMock).toBeCalledWith(
        'You should provide at least one translation specification',
        'error'
      )
    })

    it('Breaks with empty translation spec', () => {
      const { valid, _ } = validateAndCompileOptions(
        { googleApiKey: 'aaaa', translations: [] },
        logMock
      )
      expect(valid).toBeFalsy()
      expect(logMock).toBeCalledWith(
        'You should provide at least one translation specification',
        'error'
      )
    })

    it('Compiles translation spec into a dictionary', () => {
      const spec = createCompleteSpec(createBasicTranslation())

      const { valid, compiled } = validateAndCompileOptions(spec, logMock)

      expect(valid).toBeTruthy()
      expect(compiled['nodeselector']).toBeDefined()
    })

    it('Compiled spec includes api key', () => {
      const spec = createCompleteSpec(createBasicTranslation())

      const { valid, compiled } = validateAndCompileOptions(spec, logMock)

      expect(valid).toBeTruthy()
      expect(compiled['nodeselector'].googleApiKey).toEqual('lorem')
    })
  })
})
