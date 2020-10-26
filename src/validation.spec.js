const { validateOptions } = require('./validation')

jest.mock('./utils', () => {
  const log = () => jest.fn()
  return { log }
})

describe('validation functions', () => {
  describe('validateOptions', () => {
    it('Breaks with undefined options', () => {
      const valid = validateOptions(undefined)
      expect(valid).toBeFalsy()
    })

    it('Breaks with null options', () => {
      const valid = validateOptions(undefined)
      expect(valid).toBeFalsy()
    })

    it('Breaks without source language', () => {
      const valid = validateOptions({})
      expect(valid).toBeFalsy()
    })

    it('Breaks without target language', () => {
      const valid = validateOptions({ sourceLanguage: 'en' })
      expect(valid).toBeFalsy()
    })

    it('Breaks without google api key when a translation spec is set', () => {
      const valid = validateOptions({
        sourceLanguage: 'en',
        targetLanguages: ['en'],
        translations: [{}],
      })
      expect(valid).toBeFalsy()
    })
  })
})
